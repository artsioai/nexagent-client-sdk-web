import type { ChatCompletionMessageParam } from 'openai/resources';

import DailyIframe, {
  DailyCall,
  DailyAdvancedConfig,
  DailyFactoryOptions,
  DailyEventObjectAppMessage,
  DailyEventObjectParticipant,
  DailyEventObjectRemoteParticipantsAudioLevel,
  DailyParticipant,
  DailyVideoSendSettings,
  DailyCallOptions,
} from '@daily-co/daily-js';
import EventEmitter from 'events';

import type { CreateAssistantDTO, WebCallResponse } from './api';
import { client } from './client';
import {
  createSafeDailyConfig,
  createSafeDailyFactoryOptions,
  safeSetLocalAudio,
  safeSetInputDevicesAsync,
} from './daily-guards';

export interface EndCallMessage {
  type: 'end-call';
}

export interface AddMessageMessage {
  type: 'add-message';
  message: ChatCompletionMessageParam;
  triggerResponseEnabled?: boolean;
}

export interface ControlMessages {
  type: 'control';
  control: 'mute-assistant' | 'unmute-assistant' | 'say-first-message';
  videoRecordingStartDelaySeconds?: number;
}

export interface SayMessage {
  type: 'say';
  message: string;
  endCallAfterSpoken?: boolean;
  interruptionsEnabled?: boolean;
  interruptAssistantEnabled?: boolean;
}

type NexAgentClientToServerMessage =
  | AddMessageMessage
  | ControlMessages
  | SayMessage
  | EndCallMessage;

type NexAgentEventNames =
  | 'call-end'
  | 'call-start'
  | 'volume-level'
  | 'speech-start'
  | 'speech-end'
  | 'message'
  | 'video'
  | 'error'
  | 'camera-error'
  | 'network-quality-change'
  | 'network-connection'
  | 'daily-participant-updated'
  | 'call-start-progress'
  | 'call-start-success'
  | 'call-start-failed';

interface CallStartProgressEvent {
  stage: string;
  status: 'started' | 'completed' | 'failed';
  duration?: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface CallStartSuccessEvent {
  totalDuration: number;
  callId?: string;
  timestamp: string;
}

interface CallStartFailedEvent {
  stage: string;
  totalDuration: number;
  error: string;
  errorStack?: string;
  timestamp: string;
  context: Record<string, any>;
}

type NexAgentEventListeners = {
  'call-end': () => void;
  'call-start': () => void;
  'volume-level': (volume: number) => void;
  'speech-start': () => void;
  'speech-end': () => void;
  video: (track: MediaStreamTrack) => void;
  message: (message: any) => void;
  error: (error: any) => void;
  'camera-error': (error: any) => void;
  'network-quality-change': (event: any) => void;
  'network-connection': (event: any) => void;
  'daily-participant-updated': (participant: DailyParticipant) => void;
  'call-start-progress': (event: CallStartProgressEvent) => void;
  'call-start-success': (event: CallStartSuccessEvent) => void;
  'call-start-failed': (event: CallStartFailedEvent) => void;
};

type StartCallOptions = {
  /**
   * Optional display name stored alongside the call record.
   */
  name?: string | null;
  /**
   * Arbitrary metadata persisted on the call record.
   */
  metadata?: Record<string, any> | null;
};

type WebCall = WebCallResponse & {
  /**
   * Present when the API returns artifact information for the call.
   */
  artifactPlan?: { videoRecordingEnabled?: boolean };
  /**
   * Present when the API returns assistant information for the call.
   */
  assistant?: { voice?: { provider?: string } };
};

async function startAudioPlayer(
  player: HTMLAudioElement,
  track: MediaStreamTrack,
) {
  player.muted = false;
  player.autoplay = true;
  if (track != null) {
    player.srcObject = new MediaStream([track]);
    await player.play();
  }
}

async function buildAudioPlayer(
  track: MediaStreamTrack,
  participantId: string,
) {
  const player = document.createElement('audio');
  player.dataset.participantId = participantId;
  document.body.appendChild(player);
  await startAudioPlayer(player, track);
  return player;
}

function destroyAudioPlayer(participantId: string) {
  const player = document.querySelector(
    `audio[data-participant-id="${participantId}"]`,
  );
  player?.remove();
}

function subscribeToTracks(
  e: DailyEventObjectParticipant,
  call: DailyCall,
  isVideoRecordingEnabled?: boolean,
  isVideoEnabled?: boolean,
) {
  if (e.participant.local) return;

  call.updateParticipant(e.participant.session_id, {
    setSubscribedTracks: {
      audio: true,
      video: isVideoRecordingEnabled || isVideoEnabled,
    },
  });
}

class NexAgentEventEmitter extends EventEmitter {
  on<E extends NexAgentEventNames>(
    event: E,
    listener: NexAgentEventListeners[E],
  ): this {
    super.on(event, listener);
    return this;
  }
  once<E extends NexAgentEventNames>(
    event: E,
    listener: NexAgentEventListeners[E],
  ): this {
    super.once(event, listener);
    return this;
  }
  emit<E extends NexAgentEventNames>(
    event: E,
    ...args: Parameters<NexAgentEventListeners[E]>
  ): boolean {
    return super.emit(event, ...args);
  }
  removeListener<E extends NexAgentEventNames>(
    event: E,
    listener: NexAgentEventListeners[E],
  ): this {
    super.removeListener(event, listener);
    return this;
  }
  removeAllListeners(event?: NexAgentEventNames): this {
    super.removeAllListeners(event);
    return this;
  }
}

export default class NexAgent extends NexAgentEventEmitter {
  private started: boolean = false;
  private call: DailyCall | null = null;
  private speakingTimeout: NodeJS.Timeout | null = null;
  private dailyCallConfig: DailyAdvancedConfig = {};
  private dailyCallObject: DailyFactoryOptions = {};

  private hasEmittedCallEndedStatus: boolean = false;

  constructor(
    apiToken: string,
    apiBaseUrl?: string,
    dailyCallConfig?: Pick<
      DailyAdvancedConfig,
      'avoidEval' | 'alwaysIncludeMicInPermissionPrompt'
    >,
    dailyCallObject?: Pick<DailyFactoryOptions, 'audioSource' | 'startAudioOff'>,
  ) {
    super();
    client.baseUrl = apiBaseUrl ?? 'https://api.nexagent.ai';
    client.setSecurityData(apiToken);
    this.dailyCallConfig = createSafeDailyConfig(dailyCallConfig);
    this.dailyCallObject = createSafeDailyFactoryOptions(dailyCallObject);
  }

  private async cleanup() {
    this.started = false;
    this.hasEmittedCallEndedStatus = false;
    if (this.call) {
      await this.call.destroy();
      this.call = null;
    }
    this.speakingTimeout = null;
  }

  private buildJoinOptions(webCall: WebCall): DailyCallOptions {
    const joinOptions: DailyCallOptions = {
      url: webCall.webCallUrl,
      subscribeToTracksAutomatically: false,
    };

    if (webCall.webCallToken) {
      joinOptions.token = webCall.webCallToken;

      try {
        const url = new URL(webCall.webCallUrl);
        url.searchParams.set('t', webCall.webCallToken);
        joinOptions.url = url.toString();
      } catch {
        const separator = webCall.webCallUrl.includes('?') ? '&' : '?';
        joinOptions.url = `${webCall.webCallUrl}${separator}t=${encodeURIComponent(
          webCall.webCallToken,
        )}`;
      }
    }

    return joinOptions;
  }

  private async preAuthIfNeeded(
    joinOptions: DailyCallOptions,
    stage: 'daily-call-preauth' | 'reconnect-preauth',
  ) {
    if (!joinOptions.token || !joinOptions.url || !this.call?.preAuth) {
      return;
    }

    const preAuthStartTime = Date.now();
    this.emit('call-start-progress', {
      stage,
      status: 'started',
      timestamp: new Date().toISOString(),
    });

    try {
      await this.call.preAuth({
        url: joinOptions.url,
        token: joinOptions.token,
      });
      this.emit('call-start-progress', {
        stage,
        status: 'completed',
        duration: Date.now() - preAuthStartTime,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.emit('call-start-progress', {
        stage,
        status: 'failed',
        duration: Date.now() - preAuthStartTime,
        timestamp: new Date().toISOString(),
        metadata: { error: error instanceof Error ? error.message : String(error) },
      });
    }
  }

  private isMobileDevice() {
    if (typeof navigator === 'undefined') {
      return false;
    }
    const userAgent = navigator.userAgent;
    return /android|iphone|ipad|ipod|iemobile|blackberry|bada/i.test(
      userAgent.toLowerCase(),
    );
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async start(
    assistant: CreateAssistantDTO | string,
    options: StartCallOptions = {},
  ): Promise<WebCall | null> {
    const startTime = Date.now();

    if (!assistant) {
      const error = new Error('Assistant must be provided.');
      this.emit('error', {
        type: 'validation-error',
        stage: 'input-validation',
        message: error.message,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }

    if (this.started) {
      this.emit('call-start-progress', {
        stage: 'validation',
        status: 'failed',
        timestamp: new Date().toISOString(),
        metadata: { reason: 'already-started' }
      });
      return null;
    }
    
    this.emit('call-start-progress', {
      stage: 'initialization',
      status: 'started',
      timestamp: new Date().toISOString(),
      metadata: {
        hasAssistant: !!assistant,
        callName: options?.name ?? null,
      },
    });
    
    this.started = true;

    try {
      let assistantId: string | undefined;

      if (typeof assistant === 'string') {
        assistantId = assistant;
      } else {
        this.emit('call-start-progress', {
          stage: 'assistant-preparation',
          status: 'started',
          timestamp: new Date().toISOString(),
        });

        const assistantStartTime = Date.now();
        try {
          const createdAssistant = (
            await client.assistant.createAssistantEndpointAssistantPost(
              assistant,
            )
          ).data;
          assistantId = createdAssistant?.id;
          const assistantDuration = Date.now() - assistantStartTime;
          this.emit('call-start-progress', {
            stage: 'assistant-preparation',
            status: 'completed',
            duration: assistantDuration,
            timestamp: new Date().toISOString(),
            metadata: { assistantId },
          });
        } catch (error) {
          const assistantDuration = Date.now() - assistantStartTime;
          this.emit('call-start-progress', {
            stage: 'assistant-preparation',
            status: 'failed',
            duration: assistantDuration,
            timestamp: new Date().toISOString(),
            metadata: { error: error instanceof Error ? error.message : String(error) },
          });
          this.emit('error', {
            type: 'assistant-preparation-error',
            stage: 'assistant-preparation',
            error,
            timestamp: new Date().toISOString(),
          });
          throw error;
        }
      }

      if (!assistantId) {
        const error = new Error('Unable to resolve assistant ID.');
        this.emit('error', {
          type: 'validation-error',
          stage: 'assistant-preparation',
          message: error.message,
          timestamp: new Date().toISOString(),
        });
        throw error;
      }

      // Stage 1: Create web call
      this.emit('call-start-progress', {
        stage: 'web-call-creation',
        status: 'started',
        timestamp: new Date().toISOString()
      });
      
      const webCallStartTime = Date.now();
      
      let webCall: WebCall;
      try {
        webCall = (
          await client.call.createWebCallEndpointCallWebPost({
            assistantId,
            name: options?.name ?? undefined,
            metadata: options?.metadata ?? undefined,
          })
        ).data as WebCall;
      } catch (error) {
        const webCallDuration = Date.now() - webCallStartTime;
        this.emit('call-start-progress', {
          stage: 'web-call-creation',
          status: 'failed',
          duration: webCallDuration,
          timestamp: new Date().toISOString(),
          metadata: {
            assistantId,
            error: error instanceof Error ? error.message : String(error),
          },
        });
        this.emit('error', {
          type: 'web-call-creation-error',
          stage: 'web-call-creation',
          error,
          timestamp: new Date().toISOString(),
        });
        throw error;
      }

      const webCallDuration = Date.now() - webCallStartTime;
      this.emit('call-start-progress', {
        stage: 'web-call-creation',
        status: 'completed',
        duration: webCallDuration,
        timestamp: new Date().toISOString(),
        metadata: {
          assistantId,
          callId: webCall?.id || 'unknown',
          videoRecordingEnabled:
            webCall?.artifactPlan?.videoRecordingEnabled ?? false,
          voiceProvider: webCall?.assistant?.voice?.provider || 'unknown',
          callName: options?.name ?? null,
        },
      });

      if (this.call) {
        this.emit('call-start-progress', {
          stage: 'daily-call-object-creation',
          status: 'started',
          timestamp: new Date().toISOString(),
          metadata: { action: 'cleanup-existing' }
        });
        await this.cleanup();
      }

      const isVideoRecordingEnabled =
        webCall?.artifactPlan?.videoRecordingEnabled ?? false;

      const isVideoEnabled = webCall?.assistant?.voice?.provider === 'tavus';

      // Stage 2: Create Daily call object
      this.emit('call-start-progress', {
        stage: 'daily-call-object-creation',
        status: 'started',
        timestamp: new Date().toISOString(),
        metadata: {
          audioSource: this.dailyCallObject.audioSource ?? true,
          videoSource: this.dailyCallObject.videoSource ?? isVideoRecordingEnabled,
          isVideoRecordingEnabled,
          isVideoEnabled
        }
      });
      
      const dailyCallStartTime = Date.now();
      
      try {
        this.call = DailyIframe.createCallObject({
          audioSource: this.dailyCallObject.audioSource ?? true,
          videoSource: this.dailyCallObject.videoSource ?? isVideoRecordingEnabled,
          dailyConfig: this.dailyCallConfig,
        });
        
        const dailyCallDuration = Date.now() - dailyCallStartTime;
        this.emit('call-start-progress', {
          stage: 'daily-call-object-creation',
          status: 'completed',
          duration: dailyCallDuration,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        const dailyCallDuration = Date.now() - dailyCallStartTime;
        this.emit('call-start-progress', {
          stage: 'daily-call-object-creation',
          status: 'failed',
          duration: dailyCallDuration,
          timestamp: new Date().toISOString(),
          metadata: { error: error?.toString() }
        });
        this.emit('error', {
          type: 'daily-call-object-creation-error',
          stage: 'daily-call-object-creation',
          error,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
      
      this.call.iframe()?.style.setProperty('display', 'none');

      this.call.on('left-meeting', () => {
        this.emit('call-end');
        if (!this.hasEmittedCallEndedStatus) {
          this.emit('message', {
            type: 'status-update',
            status: 'ended',
            'endedReason': 'customer-ended-call',
          });
          this.hasEmittedCallEndedStatus = true;
        }
        if (isVideoRecordingEnabled) {
          this.call?.stopRecording();
        }
        this.cleanup().catch(console.error);
      });

      this.call.on('error', (error: any) => {
        this.emit('error', error);
        if (isVideoRecordingEnabled) {
          this.call?.stopRecording();
        }
      });

      this.call.on('camera-error', (error: any) => {
        this.emit('camera-error', error);
      });

      this.call.on('network-quality-change', (event: any) => {
        this.emit('network-quality-change', event);
      });

      this.call.on('network-connection', (event: any) => {
        this.emit('network-connection', event);
      });

      this.call.on('track-started', async (e) => {
        if (!e || !e.participant) {
          return;
        }
        if (e.participant?.local) {
          return;
        }
        if (e.participant?.user_name !== 'NexAgent Speaker') {
          return;
        }
        if (e.track.kind === 'video') {
          this.emit('video', e.track);
        }
        if (e.track.kind === 'audio') {
          await buildAudioPlayer(e.track, e.participant.session_id);
        }
        this.call?.sendAppMessage('playable');
      });

      this.call.on('participant-joined', (e) => {
        if (!e || !this.call) return;
        subscribeToTracks(
          e,
          this.call,
          isVideoRecordingEnabled,
          isVideoEnabled,
        );
      });

      this.call.on('participant-updated', (e) => {
        if (!e) {
          return;
        }
        this.emit('daily-participant-updated', e.participant);
      });

      this.call.on('participant-left', (e) => {
        if (!e) {
          return;
        }
        destroyAudioPlayer(e.participant.session_id);
      });

      // Stage 3: Mobile device handling and permissions
      const isMobile = this.isMobileDevice();
      this.emit('call-start-progress', {
        stage: 'mobile-permissions',
        status: 'started',
        timestamp: new Date().toISOString(),
        metadata: { isMobile }
      });
      
      if (isMobile) {
        const mobileWaitStartTime = Date.now();
        await this.sleep(1000);
        const mobileWaitDuration = Date.now() - mobileWaitStartTime;
        this.emit('call-start-progress', {
          stage: 'mobile-permissions',
          status: 'completed',
          duration: mobileWaitDuration,
          timestamp: new Date().toISOString(),
          metadata: { action: 'permissions-wait' }
        });
      } else {
        this.emit('call-start-progress', {
          stage: 'mobile-permissions',
          status: 'completed',
          timestamp: new Date().toISOString(),
          metadata: { action: 'skipped-not-mobile' }
        });
      }

      // Stage 4: Join the call
      this.emit('call-start-progress', {
        stage: 'daily-call-join',
        status: 'started',
        timestamp: new Date().toISOString()
      });
      
      const joinStartTime = Date.now();
      
      const joinOptions = this.buildJoinOptions(webCall);
      await this.preAuthIfNeeded(joinOptions, 'daily-call-preauth');

      try {
        await this.call.join(joinOptions);
        
        const joinDuration = Date.now() - joinStartTime;
        try {
          safeSetLocalAudio(this.call, true);
        } catch (audioError) {
          console.error('Failed to enable local audio:', audioError);
        }
        this.emit('call-start-progress', {
          stage: 'daily-call-join',
          status: 'completed',
          duration: joinDuration,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        const joinDuration = Date.now() - joinStartTime;
        this.emit('call-start-progress', {
          stage: 'daily-call-join',
          status: 'failed',
          duration: joinDuration,
          timestamp: new Date().toISOString(),
          metadata: { error: error?.toString() }
        });
        this.emit('error', {
          type: 'daily-call-join-error',
          stage: 'daily-call-join',
          error,
          duration: joinDuration,
          timestamp: new Date().toISOString()
        });
        throw error;
      }

      // Stage 5: Video recording setup (if enabled)
      if (isVideoRecordingEnabled) {
        this.emit('call-start-progress', {
          stage: 'video-recording-setup',
          status: 'started',
          timestamp: new Date().toISOString()
        });
        
        const recordingRequestedTime = new Date().getTime();
        const recordingStartTime = Date.now();

        try {
          this.call.startRecording({
            width: 1280,
            height: 720,
            backgroundColor: '#FF1F2D3D',
            layout: {
              preset: 'default',
            },
          });

          const recordingSetupDuration = Date.now() - recordingStartTime;
          this.emit('call-start-progress', {
            stage: 'video-recording-setup',
            status: 'completed',
            duration: recordingSetupDuration,
            timestamp: new Date().toISOString()
          });

          this.call.on('recording-started', () => {
            const totalRecordingDelay = (new Date().getTime() - recordingRequestedTime) / 1000;
            this.emit('call-start-progress', {
              stage: 'video-recording-started',
              status: 'completed',
              timestamp: new Date().toISOString(),
              metadata: { delaySeconds: totalRecordingDelay }
            });
            
            this.send({
              type: 'control',
              control: 'say-first-message',
              videoRecordingStartDelaySeconds: totalRecordingDelay,
            });
          });
        } catch (error) {
          const recordingSetupDuration = Date.now() - recordingStartTime;
          this.emit('call-start-progress', {
            stage: 'video-recording-setup',
            status: 'failed',
            duration: recordingSetupDuration,
            timestamp: new Date().toISOString(),
            metadata: { error: error?.toString() }
          });
          this.emit('error', {
            type: 'video-recording-setup-error',
            stage: 'video-recording-setup',
            error,
            timestamp: new Date().toISOString()
          });
          // Don't throw here, video recording is optional
        }
      } else {
        this.emit('call-start-progress', {
          stage: 'video-recording-setup',
          status: 'completed',
          timestamp: new Date().toISOString(),
          metadata: { action: 'skipped-not-enabled' }
        });
      }

      // Stage 6: Audio level observer setup
      this.emit('call-start-progress', {
        stage: 'audio-observer-setup',
        status: 'started',
        timestamp: new Date().toISOString()
      });
      
      const audioObserverStartTime = Date.now();
      
      try {
        this.call.startRemoteParticipantsAudioLevelObserver(100);
        const audioObserverDuration = Date.now() - audioObserverStartTime;
        this.emit('call-start-progress', {
          stage: 'audio-observer-setup',
          status: 'completed',
          duration: audioObserverDuration,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        const audioObserverDuration = Date.now() - audioObserverStartTime;
        this.emit('call-start-progress', {
          stage: 'audio-observer-setup',
          status: 'failed',
          duration: audioObserverDuration,
          timestamp: new Date().toISOString(),
          metadata: { error: error?.toString() }
        });
        this.emit('error', {
          type: 'audio-observer-setup-error',
          stage: 'audio-observer-setup',
          error,
          timestamp: new Date().toISOString()
        });
        // Don't throw here, this is non-critical
      }

      this.call.on('remote-participants-audio-level', (e) => {
        if (e) this.handleRemoteParticipantsAudioLevel(e);
      });

      this.call.on('app-message', (e) => this.onAppMessage(e));

      this.call.on('nonfatal-error', (e) => {
        // https://docs.daily.co/reference/daily-js/events/meeting-events#type-audio-processor-error
        if (e?.type === 'audio-processor-error') {
          this.call
            ?.updateInputSettings({
              audio: {
                processor: {
                  type: 'none',
                },
              },
            })
            .then(() => {
              safeSetLocalAudio(this.call, true);
            });
        }
      });

      // Stage 7: Audio processing setup
      this.emit('call-start-progress', {
        stage: 'audio-processing-setup',
        status: 'started',
        timestamp: new Date().toISOString()
      });
      
      const audioProcessingStartTime = Date.now();
      
      try {
        this.call.updateInputSettings({
          audio: {
            processor: {
              type: 'noise-cancellation',
            },
          },
        });
        
        const audioProcessingDuration = Date.now() - audioProcessingStartTime;
        this.emit('call-start-progress', {
          stage: 'audio-processing-setup',
          status: 'completed',
          duration: audioProcessingDuration,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        const audioProcessingDuration = Date.now() - audioProcessingStartTime;
        this.emit('call-start-progress', {
          stage: 'audio-processing-setup',
          status: 'failed',
          duration: audioProcessingDuration,
          timestamp: new Date().toISOString(),
          metadata: { error: error?.toString() }
        });
        this.emit('error', {
          type: 'audio-processing-setup-error',
          stage: 'audio-processing-setup',
          error,
          timestamp: new Date().toISOString()
        });
        // Don't throw here, this is non-critical
      }

      const totalDuration = Date.now() - startTime;
      this.emit('call-start-success', {
        totalDuration,
        callId: webCall?.id || 'unknown',
        timestamp: new Date().toISOString()
      });

      return webCall;
    } catch (e) {
      const totalDuration = Date.now() - startTime;
      
      this.emit('call-start-failed', {
        stage: 'unknown',
        totalDuration,
        error: e?.toString() || 'Unknown error occurred',
        errorStack: e instanceof Error ? e.stack : 'No stack trace available',
        timestamp: new Date().toISOString(),
        context: {
          hasAssistant: !!assistant,
          callName: options?.name ?? null,
          isMobile: this.isMobileDevice(),
        },
      });
      
      // Also emit the generic error event for backward compatibility
      this.emit('error', {
        type: 'start-method-error',
        stage: 'unknown',
        error: e,
        totalDuration,
        timestamp: new Date().toISOString(),
        context: {
          hasAssistant: !!assistant,
          callName: options?.name ?? null,
          isMobile: this.isMobileDevice(),
        },
      });
      
      await this.cleanup();
      return null;
    }
  }

  private onAppMessage(e?: DailyEventObjectAppMessage) {
    if (!e) {
      return;
    }
    try {
      if (e.data === 'listening') {
        return this.emit('call-start');
      }

      if (typeof e.data === 'object' && e.data !== null) {
        this.emit('message', e.data);
        if (
          'type' in e.data &&
          'status' in e.data &&
          e.data.type === 'status-update' &&
          e.data.status === 'ended'
        ) {
          this.hasEmittedCallEndedStatus = true;
        }
        return;
      }

      if (typeof e.data === 'string') {
        const trimmed = e.data.trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          try {
            const parsedMessage = JSON.parse(trimmed);
            this.emit('message', parsedMessage);
            if (
              parsedMessage &&
              typeof parsedMessage === 'object' &&
              'type' in parsedMessage &&
              'status' in parsedMessage &&
              parsedMessage.type === 'status-update' &&
              parsedMessage.status === 'ended'
            ) {
              this.hasEmittedCallEndedStatus = true;
            }
          } catch (parseError) {
            console.warn('[NexAgent] Unable to parse app-message:', parseError);
          }
          return;
        }

        this.emit('message', {
          type: 'raw-app-message',
          data: e.data,
        });
        return;
      }
    } catch (e) {
      console.error(e);
    }
  }

  private handleRemoteParticipantsAudioLevel(
    e: DailyEventObjectRemoteParticipantsAudioLevel,
  ) {
    const speechLevel = Object.values(e.participantsAudioLevel).reduce(
      (a, b) => a + b,
      0,
    );

    this.emit('volume-level', Math.min(1, speechLevel / 0.15));

    const isSpeaking = speechLevel > 0.01;

    if (!isSpeaking) {
      return;
    }

    if (this.speakingTimeout) {
      clearTimeout(this.speakingTimeout);
      this.speakingTimeout = null;
    } else {
      this.emit('speech-start');
    }

    this.speakingTimeout = setTimeout(() => {
      this.emit('speech-end');
      this.speakingTimeout = null;
    }, 1000);
  }

  /**
   * Stops the call by destroying the Daily call object and clearing local state.
   */
  async stop(): Promise<void> {
    this.started = false;
    if (this.call) {
      await this.call.destroy();
      this.call = null;
    }
    this.speakingTimeout = null;
  }

  /**
   * Sends a Live Call Control message to the NexAgent server.
   * 
   * Docs: https://docs.nexagent.ai/calls/call-features
   */
  send(message: NexAgentClientToServerMessage): void {
    this.call?.sendAppMessage(JSON.stringify(message));
  }

  public setMuted(mute: boolean) {
    safeSetLocalAudio(this.call, !mute);
  }

  public isMuted() {
    if (!this.call) {
      return false;
    }
    return this.call.localAudio() === false;
  }

  public say(message: string, endCallAfterSpoken?: boolean, 
    interruptionsEnabled?: boolean, interruptAssistantEnabled?: boolean) {
    this.send({
      type: 'say',
      message,
      endCallAfterSpoken,
      interruptionsEnabled: interruptionsEnabled ?? false,
      interruptAssistantEnabled: interruptAssistantEnabled ?? false,
    });
  }

  /**
   * Ends the call immediately by sending an `end-call` message using Live Call Control, then destroys the Daily call object.
   */
  public end() {
    this.send({
      type: 'end-call',
    });
    this.stop();
  }

  public setInputDevicesAsync(
    options: Parameters<DailyCall['setInputDevicesAsync']>[0],
  ) {
    return safeSetInputDevicesAsync(this.call, options);
  }

  public async increaseMicLevel(gain: number) {
    if (!this.call) {
      throw new Error('Call object is not available.');
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
  
      const source = audioContext.createMediaStreamSource(stream);
      
      const gainNode = audioContext.createGain();
      gainNode.gain.value = gain;
      
      source.connect(gainNode);
      
      const destination = audioContext.createMediaStreamDestination();
      gainNode.connect(destination);
  
      const [boostedTrack] = destination.stream.getAudioTracks();
      await safeSetInputDevicesAsync(this.call, { audioSource: boostedTrack });      
    } catch (error) {
      console.error("Error adjusting microphone level:", error);
    }
  }  

  public setOutputDeviceAsync(
    options: Parameters<DailyCall['setOutputDeviceAsync']>[0],
  ) {
    this.call?.setOutputDeviceAsync(options);
  }

  public getDailyCallObject(): DailyCall | null {
    return this.call;
  }

  public startScreenSharing(displayMediaOptions?: DisplayMediaStreamOptions, screenVideoSendSettings?: DailyVideoSendSettings) {
    this.call?.startScreenShare({
      displayMediaOptions,
      screenVideoSendSettings,
    });
  }

  public stopScreenSharing() {
    this.call?.stopScreenShare();
  }

  /**
   * Reconnects to an active call.
   * 
   * 
   * @param webCall 
   */
  async reconnect(webCall: WebCall): Promise<void> {
    const startTime = Date.now();
    
    if (this.started) {
      throw new Error('Cannot reconnect while a call is already in progress. Call stop() first.');
    }

    if (!webCall.webCallUrl) {
      throw new Error('webCallUrl is required for reconnection.');
    }

    this.emit('call-start-progress', {
      stage: 'reconnect-initialization',
      status: 'started',
      timestamp: new Date().toISOString(),
      metadata: {
        callId: webCall.id || 'unknown',
        hasVideoRecording: !!webCall?.artifactPlan?.videoRecordingEnabled,
        voiceProvider: webCall?.assistant?.voice?.provider || 'unknown'
      }
    });

    this.started = true;

    try {
      // Clean up any existing call object
      if (this.call) {
        this.emit('call-start-progress', {
          stage: 'cleanup-existing-call',
          status: 'started',
          timestamp: new Date().toISOString()
        });
        await this.cleanup();
        this.emit('call-start-progress', {
          stage: 'cleanup-existing-call',
          status: 'completed',
          timestamp: new Date().toISOString()
        });
      }

      const isVideoRecordingEnabled = webCall?.artifactPlan?.videoRecordingEnabled ?? false;
      const isVideoEnabled = webCall?.assistant?.voice?.provider === 'tavus';

      // Stage 1: Create Daily call object
      this.emit('call-start-progress', {
        stage: 'daily-call-object-creation',
        status: 'started',
        timestamp: new Date().toISOString(),
        metadata: {
          audioSource: this.dailyCallObject.audioSource ?? true,
          videoSource: this.dailyCallObject.videoSource ?? isVideoRecordingEnabled,
          isVideoRecordingEnabled,
          isVideoEnabled
        }
      });

      const dailyCallStartTime = Date.now();
      this.call = DailyIframe.createCallObject({
        audioSource: this.dailyCallObject.audioSource ?? true,
        videoSource: this.dailyCallObject.videoSource ?? isVideoRecordingEnabled,
        dailyConfig: this.dailyCallConfig,
      });

      const dailyCallDuration = Date.now() - dailyCallStartTime;
      this.emit('call-start-progress', {
        stage: 'daily-call-object-creation',
        status: 'completed',
        duration: dailyCallDuration,
        timestamp: new Date().toISOString()
      });

      this.call.iframe()?.style.setProperty('display', 'none');

      // Set up event listeners
      this.call.on('left-meeting', () => {
        this.emit('call-end');
        if (!this.hasEmittedCallEndedStatus) {
          this.emit('message', {
            type: 'status-update',
            status: 'ended',
            'endedReason': 'customer-ended-call',
          });
          this.hasEmittedCallEndedStatus = true;
        }
        if (isVideoRecordingEnabled) {
          this.call?.stopRecording();
        }
        this.cleanup().catch(console.error);
      });

      this.call.on('error', (error: any) => {
        this.emit('error', error);
        if (isVideoRecordingEnabled) {
          this.call?.stopRecording();
        }
      });

      this.call.on('camera-error', (error: any) => {
        this.emit('camera-error', error);
      });

      this.call.on('network-quality-change', (event: any) => {
        this.emit('network-quality-change', event);
      });

      this.call.on('network-connection', (event: any) => {
        this.emit('network-connection', event);
      });

      this.call.on('track-started', async (e) => {
        if (!e || !e.participant) {
          return;
        }
        if (e.participant?.local) {
          return;
        }
        if (e.participant?.user_name !== 'NexAgent Speaker') {
          return;
        }
        if (e.track.kind === 'video') {
          this.emit('video', e.track);
        }
        if (e.track.kind === 'audio') {
          await buildAudioPlayer(e.track, e.participant.session_id);
        }
        this.call?.sendAppMessage('playable');
      });

      this.call.on('participant-joined', (e) => {
        if (!e || !this.call) return;
        subscribeToTracks(
          e,
          this.call,
          isVideoRecordingEnabled,
          isVideoEnabled,
        );
      });

      this.call.on('participant-updated', (e) => {
        if (!e) {
          return;
        }
        this.emit('daily-participant-updated', e.participant);
      });

      this.call.on('participant-left', (e) => {
        if (!e) {
          return;
        }
        destroyAudioPlayer(e.participant.session_id);
      });

      this.call.on('remote-participants-audio-level', (e) => {
        if (e) this.handleRemoteParticipantsAudioLevel(e);
      });

      this.call.on('app-message', (e) => this.onAppMessage(e));

      this.call.on('nonfatal-error', (e) => {
        // https://docs.daily.co/reference/daily-js/events/meeting-events#type-audio-processor-error
        if (e?.type === 'audio-processor-error') {
          this.call
            ?.updateInputSettings({
              audio: {
                processor: {
                  type: 'none',
                },
              },
            })
            .then(() => {
              safeSetLocalAudio(this.call, true);
            });
        }
      });

      // Stage 2: Mobile device handling and permissions
      const isMobile = this.isMobileDevice();
      this.emit('call-start-progress', {
        stage: 'mobile-permissions',
        status: 'started',
        timestamp: new Date().toISOString(),
        metadata: { isMobile }
      });
      
      if (isMobile) {
        const mobileWaitStartTime = Date.now();
        await this.sleep(1000);
        const mobileWaitDuration = Date.now() - mobileWaitStartTime;
        this.emit('call-start-progress', {
          stage: 'mobile-permissions',
          status: 'completed',
          duration: mobileWaitDuration,
          timestamp: new Date().toISOString(),
          metadata: { action: 'permissions-wait' }
        });
      } else {
        this.emit('call-start-progress', {
          stage: 'mobile-permissions',
          status: 'completed',
          timestamp: new Date().toISOString(),
          metadata: { action: 'skipped-not-mobile' }
        });
      }

      // Stage 3: Join the call
      this.emit('call-start-progress', {
        stage: 'daily-call-join',
        status: 'started',
        timestamp: new Date().toISOString()
      });
      
      const joinStartTime = Date.now();
      const joinOptions = this.buildJoinOptions(webCall);
      await this.preAuthIfNeeded(joinOptions, 'reconnect-preauth');
      await this.call.join(joinOptions);
      try {
        safeSetLocalAudio(this.call, true);
      } catch (audioError) {
        console.error('Failed to enable local audio on reconnect:', audioError);
      }
      
      const joinDuration = Date.now() - joinStartTime;
      this.emit('call-start-progress', {
        stage: 'daily-call-join',
        status: 'completed',
        duration: joinDuration,
        timestamp: new Date().toISOString()
      });

      // Stage 4: Video recording setup (if enabled)
      if (isVideoRecordingEnabled) {
        this.emit('call-start-progress', {
          stage: 'video-recording-setup',
          status: 'started',
          timestamp: new Date().toISOString()
        });
        
        const recordingStartTime = Date.now();
        const recordingRequestedTime = new Date().getTime();

        try {
          this.call.startRecording({
            width: 1280,
            height: 720,
            backgroundColor: '#FF1F2D3D',
            layout: {
              preset: 'default',
            },
          });

          const recordingSetupDuration = Date.now() - recordingStartTime;
          this.emit('call-start-progress', {
            stage: 'video-recording-setup',
            status: 'completed',
            duration: recordingSetupDuration,
            timestamp: new Date().toISOString()
          });

          this.call.on('recording-started', () => {
            const totalRecordingDelay = (new Date().getTime() - recordingRequestedTime) / 1000;
            this.emit('call-start-progress', {
              stage: 'video-recording-started',
              status: 'completed',
              timestamp: new Date().toISOString(),
              metadata: { delaySeconds: totalRecordingDelay }
            });
            
            this.send({
              type: 'control',
              control: 'say-first-message',
              videoRecordingStartDelaySeconds: totalRecordingDelay,
            });
          });
        } catch (error) {
          const recordingSetupDuration = Date.now() - recordingStartTime;
          this.emit('call-start-progress', {
            stage: 'video-recording-setup',
            status: 'failed',
            duration: recordingSetupDuration,
            timestamp: new Date().toISOString(),
            metadata: { error: error?.toString() }
          });
          // Don't throw here, video recording is optional
        }
      } else {
        this.emit('call-start-progress', {
          stage: 'video-recording-setup',
          status: 'completed',
          timestamp: new Date().toISOString(),
          metadata: { action: 'skipped-not-enabled' }
        });
      }

      // Stage 5: Audio level observer setup
      this.emit('call-start-progress', {
        stage: 'audio-observer-setup',
        status: 'started',
        timestamp: new Date().toISOString()
      });
      
      const audioObserverStartTime = Date.now();
      
      try {
        this.call.startRemoteParticipantsAudioLevelObserver(100);
        const audioObserverDuration = Date.now() - audioObserverStartTime;
        this.emit('call-start-progress', {
          stage: 'audio-observer-setup',
          status: 'completed',
          duration: audioObserverDuration,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        const audioObserverDuration = Date.now() - audioObserverStartTime;
        this.emit('call-start-progress', {
          stage: 'audio-observer-setup',
          status: 'failed',
          duration: audioObserverDuration,
          timestamp: new Date().toISOString(),
          metadata: { error: error?.toString() }
        });
        // Don't throw here, this is non-critical
      }

      // Stage 6: Audio processing setup
      this.emit('call-start-progress', {
        stage: 'audio-processing-setup',
        status: 'started',
        timestamp: new Date().toISOString()
      });
      
      const audioProcessingStartTime = Date.now();
      
      try {
        this.call.updateInputSettings({
          audio: {
            processor: {
              type: 'noise-cancellation',
            },
          },
        });
        
        const audioProcessingDuration = Date.now() - audioProcessingStartTime;
        this.emit('call-start-progress', {
          stage: 'audio-processing-setup',
          status: 'completed',
          duration: audioProcessingDuration,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        const audioProcessingDuration = Date.now() - audioProcessingStartTime;
        this.emit('call-start-progress', {
          stage: 'audio-processing-setup',
          status: 'failed',
          duration: audioProcessingDuration,
          timestamp: new Date().toISOString(),
          metadata: { error: error?.toString() }
        });
        // Don't throw here, this is non-critical
      }

      const totalDuration = Date.now() - startTime;
      this.emit('call-start-success', {
        totalDuration,
        callId: webCall?.id || 'unknown',
        timestamp: new Date().toISOString()
      });

      this.emit('call-start');

    } catch (e) {
      const totalDuration = Date.now() - startTime;
      
      this.emit('call-start-failed', {
        stage: 'reconnect',
        totalDuration,
        error: e?.toString() || 'Unknown error occurred',
        errorStack: e instanceof Error ? e.stack : 'No stack trace available',
        timestamp: new Date().toISOString(),
        context: {
          isReconnect: true,
          callId: webCall?.id || 'unknown',
          hasVideoRecording: !!webCall?.artifactPlan?.videoRecordingEnabled,
          voiceProvider: webCall?.assistant?.voice?.provider || 'unknown',
          isMobile: this.isMobileDevice()
        }
      });
      
      // Also emit the generic error event for backward compatibility
      this.emit('error', {
        type: 'reconnect-error',
        error: e,
        totalDuration,
        timestamp: new Date().toISOString(),
        context: {
          isReconnect: true,
          callId: webCall?.id || 'unknown',
          hasVideoRecording: !!webCall?.artifactPlan?.videoRecordingEnabled,
          voiceProvider: webCall?.assistant?.voice?.provider || 'unknown',
          isMobile: this.isMobileDevice()
        }
      });
      
      await this.cleanup();
      throw e;
    }
  }
}
