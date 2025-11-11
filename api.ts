/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
 * CredentialStatus
 * Valid credential status values.
 */
export enum CredentialStatus {
  Active = "active",
  Inactive = "inactive",
  Expired = "expired",
}

/**
 * CallType
 * Valid call type values.
 */
export enum CallType {
  InboundPhoneCall = "inboundPhoneCall",
  OutboundPhoneCall = "outboundPhoneCall",
  WebCall = "webCall",
}

/**
 * CallStatus
 * Valid call status values representing the call lifecycle.
 */
export enum CallStatus {
  Queued = "queued",
  Ringing = "ringing",
  InProgress = "in-progress",
  Forwarding = "forwarding",
  Ended = "ended",
}

/**
 * AuthenticationType
 * Valid authentication types for credentials.
 */
export enum AuthenticationType {
  Bearer = "bearer",
  ApiKey = "api_key",
  Basic = "basic",
}

/**
 * UpdateToolDTO
 * Update tool DTO using RootModel pattern with DirectAccess.
 */
export type UpdateToolDTO = {
  type: "apiRequest";
} & UpdateApiRequestToolDTO;

/** PhoneNumberCreate */
export type PhoneNumberCreate =
  | ({
      provider: "sip";
    } & CreateNexagentSIP)
  | ({
      provider: "twilio";
    } & CreateTwilioPhoneNumber);

/**
 * CreateToolDTO
 * Create tool DTO using RootModel pattern with DirectAccess.
 */
export type CreateToolDTO = {
  type: "apiRequest";
} & CreateApiRequestToolDTO;

/**
 * AmazonVoice
 * Amazon Polly voice synthesis configuration.
 */
export interface AmazonVoice {
  /**
   * Provider
   * @default "amazon"
   */
  provider?: "amazon";
  /**
   * Voiceid
   * Amazon Polly voice ID
   */
  voiceId: string;
  /**
   * Engine
   * Amazon Polly synthesis engine
   * @default "neural"
   */
  engine?: "standard" | "neural" | null;
}

/**
 * AnthropicModel
 * Anthropic model configuration.
 */
export interface AnthropicModel {
  /**
   * Messages
   * This is the starting state for the conversation.
   */
  messages?: OpenAIMessage[] | null;
  /**
   * Provider
   * @default "anthropic"
   */
  provider?: "anthropic";
  /**
   * Model
   * Anthropic model identifier (e.g., claude-3-sonnet)
   */
  model: string;
  /**
   * Temperature
   * Sampling temperature for response generation
   * @default 0.7
   */
  temperature?: number | null;
  /**
   * Maxtokens
   * Maximum number of tokens to generate
   */
  maxTokens?: number | null;
}

/**
 * ApiKeyCreate
 * Model for creating a new API key.
 *
 * Contains only the fields required for API key creation.
 * The system will automatically generate UUID values and timestamps.
 * @example {"name":"Production API Key","orgId":"org-123","tag":"private"}
 */
export interface ApiKeyCreate {
  /**
   * Orgid
   * Organization identifier
   */
  orgId: string;
  /**
   * Name
   * Human-readable API key name
   */
  name: string;
  /**
   * Tag
   * Key type: 'private' or 'public'
   * @default "private"
   */
  tag?: string;
}

/**
 * ApiKeyErrorResponse
 * Model for API key error responses with structured error information.
 *
 * Provides consistent error response format across all API key endpoints.
 * @example {"error":{"code":"API_KEY_NOT_FOUND","details":{"keyId":"550e8400-e29b-41d4-a716-446655440001"},"message":"API key not found"}}
 */
export interface ApiKeyErrorResponse {
  /**
   * Error
   * Error information
   */
  error: Record<string, any>;
}

/**
 * ApiKeyOperationResponse
 * Model for API key operation responses (create, update, delete).
 *
 * Provides consistent response format for API key management operations.
 * @example {"apiKey":{"createdAt":"2025-10-12T10:00:00Z","id":"550e8400-e29b-41d4-a716-446655440001","name":"Production API Key","orgId":"org-123","tag":"private","updatedAt":"2025-10-12T10:00:00Z"},"message":"API key created successfully"}
 */
export interface ApiKeyOperationResponse {
  /**
   * Message
   * Operation result message
   */
  message: string;
  /** API key data (for create/update operations) */
  apiKey?: ApiKeyResponse | null;
}

/**
 * ApiKeyResponse
 * Model for API key data in API responses.
 *
 * Excludes the sensitive 'value' field and includes only safe API key information.
 * Used when returning API key information to clients.
 * @example {"createdAt":"2025-10-12T10:00:00Z","id":"550e8400-e29b-41d4-a716-446655440001","name":"Production API Key","orgId":"org-123","tag":"private","updatedAt":"2025-10-12T10:00:00Z"}
 */
export interface ApiKeyResponse {
  /**
   * Id
   * API key UUID identifier
   */
  id: string;
  /**
   * Orgid
   * Organization identifier
   */
  orgId: string;
  /**
   * Name
   * Human-readable API key name
   */
  name: string;
  /**
   * Tag
   * Key type: 'private' or 'public'
   */
  tag: string;
  /**
   * Createdat
   * ISO 8601 creation timestamp
   */
  createdAt: string;
  /**
   * Updatedat
   * ISO 8601 last update timestamp
   */
  updatedAt: string;
}

/**
 * ApiRequestBody
 * Request body schema for API requests.
 */
export interface ApiRequestBody {
  /**
   * Body Schema
   * JSON schema for request body validation
   */
  body_schema: Record<string, any>;
}

/**
 * ApiRequestHeaders
 * HTTP headers configuration for API requests.
 */
export interface ApiRequestHeaders {
  /**
   * Headers
   * HTTP headers as key-value pairs
   */
  headers?: Record<string, string>;
}

/**
 * AssemblyAITranscriber
 * AssemblyAI transcriber configuration.
 */
export interface AssemblyAITranscriber {
  /**
   * Provider
   * @default "assembly-ai"
   */
  provider?: "assembly-ai";
  /**
   * Language
   * Language code for transcription
   * @default "en"
   */
  language?: string | null;
  /**
   * Confidencethreshold
   * Minimum confidence threshold for transcription
   * @default 0.4
   */
  confidenceThreshold?: number | null;
}

/**
 * AssistantResponse
 * Response DTO for assistant data.
 */
export interface AssistantResponse {
  /**
   * Id
   * Assistant unique identifier
   */
  id: string;
  /**
   * Orgid
   * Organization identifier
   */
  orgId: string;
  /**
   * Createdat
   * Creation timestamp in ISO 8601 format
   * @format date-time
   */
  createdAt: string;
  /**
   * Updatedat
   * Last update timestamp in ISO 8601 format
   * @format date-time
   */
  updatedAt: string;
  /**
   * Name
   * Assistant name
   */
  name?: string | null;
  /** Transcriber */
  transcriber:
    | ({
        provider: "assembly-ai";
      } & AssemblyAITranscriber)
    | ({
        provider: "azure";
      } & AzureSpeechTranscriber)
    | ({
        provider: "cartesia";
      } & CartesiaTranscriber)
    | ({
        provider: "deepgram";
      } & DeepgramTranscriber)
    | ({
        provider: "openai";
      } & OpenAITranscriber)
    | ({
        provider: "soniox";
      } & SonioxTranscriber);
  /** Model */
  model:
    | ({
        provider: "anthropic";
      } & AnthropicModel)
    | ({
        provider: "custom-llm";
      } & CustomLLMModel)
    | ({
        provider: "google";
      } & GoogleModel)
    | ({
        provider: "openai";
      } & OpenAIModel);
  /** Voice */
  voice:
    | ({
        provider: "amazon";
      } & AmazonVoice)
    | ({
        provider: "azure";
      } & AzureVoice)
    | ({
        provider: "cartesia";
      } & CartesiaVoice)
    | ({
        provider: "elevenlabs";
      } & ElevenLabsVoice)
    | ({
        provider: "minimax";
      } & MinimaxVoice)
    | ({
        provider: "openai";
      } & OpenAIVoice);
  /**
   * Firstmessage
   * Initial message the assistant will say
   */
  firstMessage?: string | null;
  /**
   * Metadata
   * Free-form metadata storage
   */
  metadata?: Record<string, any> | null;
}

/**
 * AuthenticationPlanCreate
 * Model for creating authentication plan configurations.
 *
 * Contains authentication plan data for credential creation requests.
 */
export interface AuthenticationPlanCreate {
  /** Authentication type */
  type: AuthenticationType;
  /**
   * Headername
   * HTTP header name for authentication
   */
  headerName: string;
  /**
   * Bearerprefixenabled
   * Include Bearer prefix for bearer tokens
   */
  bearerPrefixEnabled?: boolean | null;
  /**
   * Token
   * Bearer token (will be encrypted)
   */
  token?: string | null;
  /**
   * Apikey
   * API key (will be encrypted)
   */
  apiKey?: string | null;
  /**
   * Username
   * Username for basic authentication
   */
  username?: string | null;
  /**
   * Password
   * Password (will be encrypted)
   */
  password?: string | null;
}

/**
 * AzureSpeechTranscriber
 * Azure Speech transcriber configuration.
 */
export interface AzureSpeechTranscriber {
  /**
   * Provider
   * @default "azure"
   */
  provider?: "azure";
  /**
   * Language
   * Language code for transcription. The list of languages Azure supports can be found here: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=stt
   * @default "en-US"
   */
  language?: string | null;
  /**
   * Segmentationstrategy
   * Controls how phrase boundaries are detected, enabling either simple time/silence heuristics or more advanced semantic segmentation
   * @default "Default"
   */
  segmentationStrategy?: "Default" | "Time" | "Semantic" | null;
  /**
   * Segmentationsilencetimeoutms
   * Duration of detected silence after which the service finalizes a phrase. Configure to adjust sensitivity to pauses in speech
   */
  segmentationSilenceTimeoutMs?: number | null;
  /**
   * Segmentationmaximumtimems
   * Maximum duration a segment can reach before being cut off when using time-based segmentation
   */
  segmentationMaximumTimeMs?: number | null;
}

/**
 * AzureVoice
 * Azure voice synthesis configuration.
 */
export interface AzureVoice {
  /**
   * Provider
   * @default "azure"
   */
  provider?: "azure";
  /**
   * Voiceid
   * Provider-specific ID that will be used for Azure voice synthesis
   */
  voiceId: string;
  /**
   * Speed
   * Speed multiplier for voice synthesis
   */
  speed?: number | null;
  /**
   * Cachingenabled
   * Flag to toggle voice caching for the assistant
   * @default true
   */
  cachingEnabled?: boolean | null;
}

/**
 * CallResponse
 * Response DTO for call data.
 */
export interface CallResponse {
  /**
   * Id
   * Call unique identifier
   */
  id: string;
  /**
   * Orgid
   * Organization identifier
   */
  orgId: string;
  /** Call type */
  type: CallType;
  /** Current call status */
  status: CallStatus;
  /**
   * Createdat
   * Creation timestamp
   * @format date-time
   */
  createdAt: string;
  /**
   * Updatedat
   * Last update timestamp
   * @format date-time
   */
  updatedAt: string;
  /**
   * Startedat
   * Call start timestamp
   */
  startedAt?: string | null;
  /**
   * Endedat
   * Call end timestamp
   */
  endedAt?: string | null;
  /**
   * Name
   * Call name
   */
  name?: string | null;
  /**
   * Endedreason
   * Reason call ended
   */
  endedReason?: string | null;
  /**
   * Assistantid
   * Assistant ID reference
   */
  assistantId?: string | null;
  /**
   * Phonenumberid
   * Phone number ID reference
   */
  phoneNumberId?: string | null;
  /**
   * Metadata
   * Free-form metadata
   */
  metadata?: Record<string, any> | null;
}

/**
 * CartesiaTranscriber
 * Cartesia transcriber configuration.
 */
export interface CartesiaTranscriber {
  /**
   * Provider
   * @default "cartesia"
   */
  provider?: "cartesia";
  /**
   * Model
   * Cartesia transcription model
   * @default "ink-whisper"
   */
  model?: string | null;
  /**
   * Language
   * Language code for transcription
   * @default "en"
   */
  language?: string | null;
}

/**
 * CartesiaVoice
 * Cartesia voice synthesis configuration.
 */
export interface CartesiaVoice {
  /**
   * Provider
   * @default "cartesia"
   */
  provider?: "cartesia";
  /**
   * Cachingenabled
   * Flag to toggle voice caching for the assistant
   * @default true
   */
  cachingEnabled?: boolean | null;
  /**
   * Voiceid
   * The ID of the particular voice you want to use.
   */
  voiceId: string;
  /**
   * Model
   * This is the model that will be used. This is optional and will default to the correct model for the voiceId.
   * @default "sonic-english"
   */
  model?:
    | "sonic-2"
    | "sonic-english"
    | "sonic-multilingual"
    | "sonic-preview"
    | "sonic"
    | null;
  /**
   * Language
   * This is the language that will be used. This is optional and will default to the correct language for the voiceId.
   * @default "en"
   */
  language?:
    | "en"
    | "de"
    | "es"
    | "fr"
    | "ja"
    | "pt"
    | "zh"
    | "hi"
    | "it"
    | "ko"
    | "nl"
    | "pl"
    | "ru"
    | "sv"
    | "tr"
    | null;
}

/**
 * CreateApiRequestToolDTO
 * DTO for creating a new API request tool.
 */
export interface CreateApiRequestToolDTO {
  /**
   * Type
   * Tool type
   * @default "apiRequest"
   */
  type?: "apiRequest";
  /**
   * Name
   * Tool name
   */
  name?: string | null;
  /**
   * Description
   * Tool description
   */
  description?: string | null;
  /**
   * Method
   * HTTP method
   */
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /**
   * Url
   * API endpoint URL
   */
  url: string;
  /** HTTP headers configuration */
  headers?: ApiRequestHeaders | null;
  /** Request body schema */
  body?: ApiRequestBody | null;
  /**
   * Timeoutseconds
   * Request timeout
   */
  timeoutSeconds?: number | null;
  /**
   * Credentialid
   * Credential identifier for authentication
   */
  credentialId?: string | null;
  /**
   * Messages
   * Tool message configurations
   */
  messages?:
    | (
        | ToolMessageStart
        | ToolMessageComplete
        | ToolMessageFailed
        | ToolMessageDelayed
      )[]
    | null;
  /**
   * Metadata
   * Free-form metadata storage
   */
  metadata?: Record<string, any> | null;
}

/**
 * CreateAssistantDTO
 * DTO for creating a new assistant.
 */
export interface CreateAssistantDTO {
  /**
   * Name
   * Assistant name
   */
  name?: string | null;
  /** Transcriber */
  transcriber:
    | ({
        provider: "assembly-ai";
      } & AssemblyAITranscriber)
    | ({
        provider: "azure";
      } & AzureSpeechTranscriber)
    | ({
        provider: "cartesia";
      } & CartesiaTranscriber)
    | ({
        provider: "deepgram";
      } & DeepgramTranscriber)
    | ({
        provider: "openai";
      } & OpenAITranscriber)
    | ({
        provider: "soniox";
      } & SonioxTranscriber);
  /** Model */
  model:
    | ({
        provider: "anthropic";
      } & AnthropicModel)
    | ({
        provider: "custom-llm";
      } & CustomLLMModel)
    | ({
        provider: "google";
      } & GoogleModel)
    | ({
        provider: "openai";
      } & OpenAIModel);
  /** Voice */
  voice:
    | ({
        provider: "amazon";
      } & AmazonVoice)
    | ({
        provider: "azure";
      } & AzureVoice)
    | ({
        provider: "cartesia";
      } & CartesiaVoice)
    | ({
        provider: "elevenlabs";
      } & ElevenLabsVoice)
    | ({
        provider: "minimax";
      } & MinimaxVoice)
    | ({
        provider: "openai";
      } & OpenAIVoice);
  /**
   * Firstmessage
   * Initial message the assistant will say
   */
  firstMessage?: string | null;
  /**
   * Metadata
   * Free-form metadata storage
   */
  metadata?: Record<string, any> | null;
}

/**
 * CreateCallDTO
 * DTO for creating a new call.
 */
export interface CreateCallDTO {
  /**
   * Assistantid
   * Assistant ID reference
   */
  assistantId?: string | null;
  /**
   * Phonenumberid
   * Phone number ID reference
   */
  phoneNumberId?: string | null;
  /**
   * Name
   * Call name
   */
  name?: string | null;
  /**
   * Call type
   * @default "webCall"
   */
  type?: CallType;
  /**
   * Metadata
   * Free-form metadata
   */
  metadata?: Record<string, any> | null;
}

/**
 * CreateNexagentSIP
 * DTO for creating a Vapi phone number.
 */
export interface CreateNexagentSIP {
  /**
   * Provider
   * @default "sip"
   */
  provider?: "sip";
  /**
   * Sipidentifier
   * Will be used as: sip:identifier@None,SIP identifier can only contain letters, numbers, underscores, and hyphens
   */
  sipIdentifier?: string | null;
  /** Name */
  name?: string | null;
  /**
   * Authentication
   * SIP authentication details
   */
  authentication?: Record<string, any> | null;
  /** Assistantid */
  assistantId?: string | null;
}

/**
 * CreateTwilioPhoneNumber
 * DTO for creating a Twilio phone number.
 */
export interface CreateTwilioPhoneNumber {
  /**
   * Provider
   * @default "twilio"
   */
  provider?: "twilio";
  /**
   * Number
   * @minLength 3
   * @maxLength 40
   */
  number: string;
  /**
   * Twilioaccountsid
   * Twilio account SID
   */
  twilioAccountSid: string;
  /** Twilioauthtoken */
  twilioAuthToken?: string | null;
  /** Twilioapikey */
  twilioApiKey?: string | null;
  /** Twilioapisecret */
  twilioApiSecret?: string | null;
  /**
   * Smsenabled
   * Controls whether Vapi sets the messaging webhook URL
   * @default true
   */
  smsEnabled?: boolean;
  /** Name */
  name?: string | null;
  /** Assistantid */
  assistantId?: string | null;
}

/**
 * CreateWebCallDTO
 * DTO for creating a new call.
 */
export interface CreateWebCallDTO {
  /**
   * Assistantid
   * Assistant ID reference
   */
  assistantId: string;
  /**
   * Name
   * Call name
   */
  name?: string | null;
  /**
   * Metadata
   * Free-form metadata
   */
  metadata?: Record<string, any> | null;
}

/**
 * CredentialCreate
 * Model for creating a new credential.
 *
 * Contains only the fields required for credential creation.
 * @example {"authenticationPlan":{"bearerPrefixEnabled":true,"headerName":"Authorization","token":"your_bearer_token_here","type":"bearer"},"description":"Authentication for external webhook","metadata":{"environment":"production"},"name":"Webhook Credential","provider":"webhook"}
 */
export interface CredentialCreate {
  /**
   * Name
   * Credential name
   * @maxLength 100
   */
  name: string;
  /**
   * Provider
   * Provider type (webhook, api, etc.)
   */
  provider: string;
  /**
   * Description
   * Optional description
   */
  description?: string | null;
  /** Authentication configuration */
  authenticationPlan: AuthenticationPlanCreate;
  /**
   * Metadata
   * Custom metadata
   */
  metadata?: Record<string, any>;
}

/**
 * CredentialResponse
 * Model for credential data in API responses.
 *
 * Excludes sensitive authentication data and includes only public credential information.
 * @example {"createdAt":"2025-10-08T03:33:00.971Z","description":"Authentication for external webhook","id":"83efa71e-fb60-4538-a417-773102172b89","lastUsedAt":"2025-10-17T01:56:27.449Z","metadata":{"environment":"production"},"name":"Webhook Credential","orgId":"da9e2770-d32c-43af-af95-1b11060fd31d","provider":"webhook","status":"active","updatedAt":"2025-10-17T01:56:27.449Z","usageCount":42}
 */
export interface CredentialResponse {
  /**
   * Id
   * Unique credential identifier (UUID)
   */
  id: string;
  /**
   * Orgid
   * Organization identifier
   */
  orgId: string;
  /**
   * Name
   * Credential name
   */
  name: string;
  /**
   * Provider
   * Provider type
   */
  provider: string;
  /**
   * Description
   * Optional description
   */
  description?: string | null;
  /** Credential status */
  status: CredentialStatus;
  /**
   * Lastusedat
   * Last usage timestamp
   */
  lastUsedAt?: string | null;
  /**
   * Usagecount
   * Number of times used
   */
  usageCount: number;
  /**
   * Metadata
   * Custom metadata
   */
  metadata: Record<string, any>;
  /**
   * Createdat
   * Creation timestamp
   * @format date-time
   */
  createdAt: string;
  /**
   * Updatedat
   * Last update timestamp
   * @format date-time
   */
  updatedAt: string;
}

/**
 * CredentialUpdate
 * Model for updating credential information.
 *
 * All fields are optional to allow partial updates.
 * @example {"description":"Updated authentication for external webhook","metadata":{"environment":"staging"},"name":"Updated Webhook Credential","status":"active"}
 */
export interface CredentialUpdate {
  /**
   * Name
   * Credential name
   */
  name?: string | null;
  /**
   * Description
   * Optional description
   */
  description?: string | null;
  /** Credential status */
  status?: CredentialStatus | null;
  /** Authentication configuration */
  authenticationPlan?: AuthenticationPlanCreate | null;
  /**
   * Metadata
   * Custom metadata
   */
  metadata?: Record<string, any> | null;
}

/**
 * CustomLLMModel
 * Custom LLM model configuration.
 */
export interface CustomLLMModel {
  /**
   * Messages
   * This is the starting state for the conversation.
   */
  messages?: OpenAIMessage[] | null;
  /**
   * Provider
   * @default "custom-llm"
   */
  provider?: "custom-llm";
  /**
   * Url
   * The URL for the OpenAI client's baseURL. Ex. https://openrouter.ai/api/v1
   */
  url: string;
  /**
   * Model
   * The name of the model. Ex. cognitivecomputations/dolphin-mixtral-8x7b
   */
  model: string;
  /**
   * Temperature
   * Temperature for calls. Default is 0 to leverage caching for lower latency
   * @default 0
   */
  temperature?: number | null;
  /**
   * Maxtokens
   * Max number of tokens the assistant will be allowed to generate in each turn
   * @default 250
   */
  maxTokens?: number | null;
  /**
   * Metadatasendmode
   * Whether metadata is sent in requests to the custom provider
   * @default "variable"
   */
  metadataSendMode?: "off" | "variable" | "destructured" | null;
  /**
   * Headers
   * Custom headers to send with requests. These headers can override default OpenAI headers except for Authorization
   */
  headers?: Record<string, string> | null;
  /**
   * Wordlevelconfidenceenabled
   * Whether the transcriber's word level confidence is sent in requests. Only works for Deepgram transcribers
   * @default false
   */
  wordLevelConfidenceEnabled?: boolean | null;
  /**
   * Timeoutseconds
   * Timeout for the connection to the custom provider without needing to stream any tokens back
   * @default 20
   */
  timeoutSeconds?: number | null;
  /**
   * Emotionrecognitionenabled
   * Whether to detect user's emotion while they speak and send it as additional info to model
   * @default false
   */
  emotionRecognitionEnabled?: boolean | null;
  /**
   * Numfastturns
   * How many turns at the start of the conversation to use a smaller, faster model before switching to the primary model
   * @default 0
   */
  numFastTurns?: number | null;
}

/**
 * DeepgramTranscriber
 * Deepgram transcriber configuration.
 */
export interface DeepgramTranscriber {
  /**
   * Provider
   * @default "deepgram"
   */
  provider?: "deepgram";
  /**
   * Model
   * Deepgram transcription model
   * @default "nova-2"
   */
  model?: string | null;
  /**
   * Language
   * Language code for transcription
   * @default "en"
   */
  language?: string | null;
  /**
   * Confidencethreshold
   * Minimum confidence threshold for transcription
   * @default 0.4
   */
  confidenceThreshold?: number | null;
}

/**
 * ElevenLabsVoice
 * ElevenLabs voice synthesis configuration.
 */
export interface ElevenLabsVoice {
  /**
   * Provider
   * @default "elevenlabs"
   */
  provider?: "elevenlabs";
  /**
   * Voiceid
   * ElevenLabs voice ID
   */
  voiceId: string;
  /**
   * Stability
   * Voice stability setting
   * @default 0.5
   */
  stability?: number | null;
  /**
   * Similarityboost
   * Voice similarity boost setting
   * @default 0.5
   */
  similarityBoost?: number | null;
}

/**
 * GoogleModel
 * Google model configuration.
 */
export interface GoogleModel {
  /**
   * Messages
   * This is the starting state for the conversation.
   */
  messages?: OpenAIMessage[] | null;
  /**
   * Provider
   * @default "google"
   */
  provider?: "google";
  /**
   * Model
   * Google model identifier (e.g., gemini-pro)
   */
  model: string;
  /**
   * Temperature
   * Sampling temperature for response generation
   * @default 0.7
   */
  temperature?: number | null;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/**
 * MinimaxVoice
 * Minimax voice synthesis configuration.
 */
export interface MinimaxVoice {
  /**
   * Provider
   * @default "minimax"
   */
  provider?: "minimax";
  /**
   * Voiceid
   * Provider-specific ID. Use a voice from MINIMAX_PREDEFINED_VOICES or a custom cloned voice ID
   */
  voiceId: string;
  /**
   * Model
   * Model to use. speech-02-hd for high-fidelity, speech-02-turbo for real-time with low latency
   * @default "speech-02-turbo"
   */
  model?:
    | "speech-02-hd"
    | "speech-02-turbo"
    | "speech-2.5-turbo-preview"
    | null;
  /**
   * Emotion
   * Emotion to use for the voice. Options: happy, sad, angry, fearful, surprised, disgusted, neutral. If not provided, will use auto-detect mode
   */
  emotion?: string | null;
  /**
   * Pitch
   * Voice pitch adjustment. Range from -12 to 12 semitones
   * @default 0
   */
  pitch?: number | null;
  /**
   * Speed
   * Voice speed adjustment. Range from 0.5 to 2.0
   * @default 1
   */
  speed?: number | null;
  /**
   * Volume
   * Voice volume adjustment. Range from 0.5 to 2.0
   * @default 1
   */
  volume?: number | null;
  /**
   * Region
   * The region for Minimax API
   * @default "worldwide"
   */
  region?: "worldwide" | "china" | null;
  /**
   * Languageboost
   * Language hint for MiniMax T2A. Example: Chinese, English, Japanese, etc.
   */
  languageBoost?: string | null;
  /**
   * Textnormalizationenabled
   * Enable MiniMax text normalization to improve number reading and formatting
   * @default true
   */
  textNormalizationEnabled?: boolean | null;
  /**
   * Cachingenabled
   * Flag to toggle voice caching for the assistant
   * @default true
   */
  cachingEnabled?: boolean | null;
}

/**
 * OpenAIMessage
 * OpenAI message structure for conversation context.
 */
export interface OpenAIMessage {
  /** Role */
  role: "assistant" | "function" | "user" | "system" | "tool";
  /**
   * Content
   * Message content
   */
  content?: string | null;
}

/**
 * OpenAIModel
 * OpenAI model configuration.
 */
export interface OpenAIModel {
  /**
   * Messages
   * This is the starting state for the conversation.
   */
  messages?: OpenAIMessage[] | null;
  /**
   * Provider
   * @default "openai"
   */
  provider?: "openai";
  /**
   * Model
   * OpenAI model identifier (e.g., gpt-4, gpt-3.5-turbo)
   */
  model:
    | "gpt-5"
    | "gpt-5-mini"
    | "gpt-5-nano"
    | "gpt-4.1-2025-04-14"
    | "gpt-4.1-mini-2025-04-14"
    | "gpt-4.1-nano-2025-04-14"
    | "gpt-4.1"
    | "gpt-4.1-mini"
    | "gpt-4.1-nano"
    | "chatgpt-4o-latest"
    | "o3"
    | "o3-mini"
    | "o4-mini"
    | "o1-mini"
    | "o1-mini-2024-09-12"
    | "gpt-4o-realtime-preview-2024-10-01"
    | "gpt-4o-realtime-preview-2024-12-17"
    | "gpt-4o-mini-realtime-preview-2024-12-17"
    | "gpt-realtime-2025-08-28"
    | "gpt-4o-mini-2024-07-18"
    | "gpt-4o-mini"
    | "gpt-4o"
    | "gpt-4o-2024-05-13"
    | "gpt-4o-2024-08-06"
    | "gpt-4o-2024-11-20"
    | "gpt-4-turbo"
    | "gpt-4-turbo-2024-04-09"
    | "gpt-4-turbo-preview"
    | "gpt-4-0125-preview"
    | "gpt-4-1106-preview"
    | "gpt-4"
    | "gpt-4-0613"
    | "gpt-3.5-turbo"
    | "gpt-3.5-turbo-0125"
    | "gpt-3.5-turbo-1106"
    | "gpt-3.5-turbo-16k"
    | "gpt-3.5-turbo-0613"
    | "gpt-4.1-2025-04-14:westus"
    | "gpt-4.1-2025-04-14:eastus2"
    | "gpt-4.1-2025-04-14:eastus"
    | "gpt-4.1-2025-04-14:westus3"
    | "gpt-4.1-2025-04-14:northcentralus"
    | "gpt-4.1-2025-04-14:southcentralus"
    | "gpt-4.1-mini-2025-04-14:westus"
    | "gpt-4.1-mini-2025-04-14:eastus2"
    | "gpt-4.1-mini-2025-04-14:eastus"
    | "gpt-4.1-mini-2025-04-14:westus3"
    | "gpt-4.1-mini-2025-04-14:northcentralus"
    | "gpt-4.1-mini-2025-04-14:southcentralus"
    | "gpt-4.1-nano-2025-04-14:westus"
    | "gpt-4.1-nano-2025-04-14:eastus2"
    | "gpt-4.1-nano-2025-04-14:westus3"
    | "gpt-4.1-nano-2025-04-14:northcentralus"
    | "gpt-4.1-nano-2025-04-14:southcentralus"
    | "gpt-4o-2024-11-20:swedencentral"
    | "gpt-4o-2024-11-20:westus"
    | "gpt-4o-2024-11-20:eastus2"
    | "gpt-4o-2024-11-20:eastus"
    | "gpt-4o-2024-11-20:westus3"
    | "gpt-4o-2024-11-20:southcentralus"
    | "gpt-4o-2024-08-06:westus"
    | "gpt-4o-2024-08-06:westus3"
    | "gpt-4o-2024-08-06:eastus"
    | "gpt-4o-2024-08-06:eastus2"
    | "gpt-4o-2024-08-06:northcentralus"
    | "gpt-4o-2024-08-06:southcentralus"
    | "gpt-4o-mini-2024-07-18:westus"
    | "gpt-4o-mini-2024-07-18:westus3"
    | "gpt-4o-mini-2024-07-18:eastus"
    | "gpt-4o-mini-2024-07-18:eastus2"
    | "gpt-4o-mini-2024-07-18:northcentralus"
    | "gpt-4o-mini-2024-07-18:southcentralus"
    | "gpt-4o-2024-05-13:eastus2"
    | "gpt-4o-2024-05-13:eastus"
    | "gpt-4o-2024-05-13:northcentralus"
    | "gpt-4o-2024-05-13:southcentralus"
    | "gpt-4o-2024-05-13:westus3"
    | "gpt-4o-2024-05-13:westus"
    | "gpt-4-turbo-2024-04-09:eastus2"
    | "gpt-4-0125-preview:eastus"
    | "gpt-4-0125-preview:northcentralus"
    | "gpt-4-0125-preview:southcentralus"
    | "gpt-4-1106-preview:australia"
    | "gpt-4-1106-preview:canadaeast"
    | "gpt-4-1106-preview:france"
    | "gpt-4-1106-preview:india"
    | "gpt-4-1106-preview:norway"
    | "gpt-4-1106-preview:swedencentral"
    | "gpt-4-1106-preview:uk"
    | "gpt-4-1106-preview:westus"
    | "gpt-4-1106-preview:westus3"
    | "gpt-4-0613:canadaeast"
    | "gpt-3.5-turbo-0125:canadaeast"
    | "gpt-3.5-turbo-0125:northcentralus"
    | "gpt-3.5-turbo-0125:southcentralus"
    | "gpt-3.5-turbo-1106:canadaeast"
    | "gpt-3.5-turbo-1106:westus";
  /**
   * Temperature
   * Sampling temperature for response generation
   * @default 0.7
   */
  temperature?: number | null;
  /**
   * Maxtokens
   * Maximum number of tokens to generate
   */
  maxTokens?: number | null;
}

/**
 * OpenAITranscriber
 * OpenAI transcriber configuration.
 */
export interface OpenAITranscriber {
  /**
   * Provider
   * @default "openai"
   */
  provider?: "openai";
  /**
   * Model
   * OpenAI transcription model
   * @default "whisper-1"
   */
  model?: string | null;
  /**
   * Language
   * Language code for transcription
   * @default "en"
   */
  language?: string | null;
}

/**
 * OpenAIVoice
 * OpenAI voice synthesis configuration.
 */
export interface OpenAIVoice {
  /**
   * Provider
   * @default "openai"
   */
  provider?: "openai";
  /**
   * Voice
   * Voice identifier (e.g., alloy, echo, fable)
   */
  voice: string;
  /**
   * Speed
   * Voice speed multiplier
   * @default 1
   */
  speed?: number | null;
}

/**
 * PaginationResponse[AssistantResponse]
 * @example {"items":[],"next_token":"eyJwayI6InVzcjEyMyIsInNrIjoiYXNzaXN0YW50XzQ1NiJ9","total_count":250}
 */
export interface PaginationResponseAssistantResponse {
  /**
   * Items
   * List of items in the current page
   */
  items: AssistantResponse[];
  /**
   * Next Token
   * Token for retrieving the next page of results
   */
  next_token?: string | null;
  /**
   * Total Count
   * Total number of items available (if known)
   */
  total_count?: number | null;
}

/**
 * PaginationResponse[CallResponse]
 * @example {"items":[],"next_token":"eyJwayI6InVzcjEyMyIsInNrIjoiYXNzaXN0YW50XzQ1NiJ9","total_count":250}
 */
export interface PaginationResponseCallResponse {
  /**
   * Items
   * List of items in the current page
   */
  items: CallResponse[];
  /**
   * Next Token
   * Token for retrieving the next page of results
   */
  next_token?: string | null;
  /**
   * Total Count
   * Total number of items available (if known)
   */
  total_count?: number | null;
}

/**
 * PaginationResponse[CredentialResponse]
 * @example {"items":[],"next_token":"eyJwayI6InVzcjEyMyIsInNrIjoiYXNzaXN0YW50XzQ1NiJ9","total_count":250}
 */
export interface PaginationResponseCredentialResponse {
  /**
   * Items
   * List of items in the current page
   */
  items: CredentialResponse[];
  /**
   * Next Token
   * Token for retrieving the next page of results
   */
  next_token?: string | null;
  /**
   * Total Count
   * Total number of items available (if known)
   */
  total_count?: number | null;
}

/**
 * PaginationResponse[PhoneNumberResponse]
 * @example {"items":[],"next_token":"eyJwayI6InVzcjEyMyIsInNrIjoiYXNzaXN0YW50XzQ1NiJ9","total_count":250}
 */
export interface PaginationResponsePhoneNumberResponse {
  /**
   * Items
   * List of items in the current page
   */
  items: PhoneNumberResponse[];
  /**
   * Next Token
   * Token for retrieving the next page of results
   */
  next_token?: string | null;
  /**
   * Total Count
   * Total number of items available (if known)
   */
  total_count?: number | null;
}

/**
 * PaginationResponse[ToolResponse]
 * @example {"items":[],"next_token":"eyJwayI6InVzcjEyMyIsInNrIjoiYXNzaXN0YW50XzQ1NiJ9","total_count":250}
 */
export interface PaginationResponseToolResponse {
  /**
   * Items
   * List of items in the current page
   */
  items: ToolResponse[];
  /**
   * Next Token
   * Token for retrieving the next page of results
   */
  next_token?: string | null;
  /**
   * Total Count
   * Total number of items available (if known)
   */
  total_count?: number | null;
}

/**
 * PhoneNumberResponse
 * Response model for phone numbers - excludes sensitive credentials.
 */
export interface PhoneNumberResponse {
  /**
   * Pk
   * @default "pho"
   */
  pk?: string;
  /** Id */
  id: string;
  /** Orgid */
  orgId: string;
  /**
   * Createdat
   * @format date-time
   */
  createdAt: string;
  /**
   * Updatedat
   * @format date-time
   */
  updatedAt: string;
  /** Number */
  number: string;
  /** Name */
  name?: string | null;
  /** Assistantid */
  assistantId?: string | null;
  /** Provider */
  provider: string;
  /** Twilioaccountsid */
  twilioAccountSid?: string | null;
  /** Smsenabled */
  smsEnabled?: boolean | null;
  /** Sipidentifier */
  sipIdentifier: string | null;
  /** Sipuri */
  sipUri?: string | null;
  /** Numberdesiredareacode */
  numberDesiredAreaCode?: string | null;
  /** Lsi1 */
  lsi1?: string | null;
  /** Lsi2 */
  lsi2?: string | null;
  /** Lsi3 */
  lsi3?: string | null;
}

/**
 * PhoneNumberUpdate
 * Update model - includes all updatable fields for all providers.
 */
export interface PhoneNumberUpdate {
  /** Name */
  name?: string | null;
  /** Assistantid */
  assistantId?: string | null;
  /** Twilioauthtoken */
  twilioAuthToken?: string | null;
  /** Twilioapikey */
  twilioApiKey?: string | null;
  /** Twilioapisecret */
  twilioApiSecret?: string | null;
  /** Smsenabled */
  smsEnabled?: boolean | null;
  /** Sipuri */
  sipUri?: string | null;
  /** Authentication */
  authentication?: Record<string, any> | null;
}

/**
 * SonioxTranscriber
 * Soniox transcriber configuration.
 */
export interface SonioxTranscriber {
  /**
   * Provider
   * @default "soniox"
   */
  provider?: "soniox";
  /**
   * Model
   * Soniox transcription model
   * @default "ink-whisper"
   */
  model?: string | null;
  /**
   * Language
   * Language code for transcription
   * @default "en"
   */
  language?: string | null;
}

/**
 * ToolMessageComplete
 * Tool message for request completion.
 */
export interface ToolMessageComplete {
  /**
   * Type
   * @default "request-complete"
   */
  type?: "request-complete";
  /**
   * Content
   * Message content
   * @maxLength 1000
   */
  content: string;
  /**
   * Role
   * Message role
   */
  role?: "assistant" | "system" | null;
  /**
   * Endcallafterspokenenabled
   * End call after message is spoken
   * @default false
   */
  endCallAfterSpokenEnabled?: boolean;
}

/**
 * ToolMessageDelayed
 * Tool message for delayed response.
 */
export interface ToolMessageDelayed {
  /**
   * Type
   * @default "request-response-delayed"
   */
  type?: "request-response-delayed";
  /**
   * Content
   * Message content
   * @maxLength 1000
   */
  content: string;
  /**
   * Timingmilliseconds
   * Delay timing in milliseconds
   * @min 100
   * @max 120000
   */
  timingMilliseconds: number;
}

/**
 * ToolMessageFailed
 * Tool message for request failure.
 */
export interface ToolMessageFailed {
  /**
   * Type
   * @default "request-failed"
   */
  type?: "request-failed";
  /**
   * Content
   * Message content
   * @maxLength 1000
   */
  content: string;
  /**
   * Endcallafterspokenenabled
   * End call after message is spoken
   * @default false
   */
  endCallAfterSpokenEnabled?: boolean;
}

/**
 * ToolMessageStart
 * Tool message for request start.
 */
export interface ToolMessageStart {
  /**
   * Type
   * @default "request-start"
   */
  type?: "request-start";
  /**
   * Content
   * Message content
   * @maxLength 1000
   */
  content: string;
  /**
   * Blocking
   * Whether message blocks execution
   * @default false
   */
  blocking?: boolean;
}

/**
 * ToolResponse
 * Response DTO for tool data.
 */
export interface ToolResponse {
  /**
   * Id
   * Tool unique identifier
   */
  id: string;
  /**
   * Orgid
   * Organization identifier
   */
  orgId: string;
  /**
   * Type
   * Tool type
   */
  type: "apiRequest";
  /**
   * Createdat
   * Creation timestamp
   * @format date-time
   */
  createdAt: string;
  /**
   * Updatedat
   * Last update timestamp
   * @format date-time
   */
  updatedAt: string;
  /**
   * Name
   * Tool name
   */
  name?: string | null;
  /**
   * Description
   * Tool description
   */
  description?: string | null;
  /**
   * Method
   * HTTP method
   */
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /**
   * Url
   * API endpoint URL
   */
  url: string;
  /** HTTP headers configuration */
  headers?: ApiRequestHeaders | null;
  /** Request body schema */
  body?: ApiRequestBody | null;
  /**
   * Timeoutseconds
   * Request timeout
   */
  timeoutSeconds?: number | null;
  /**
   * Credentialid
   * Credential identifier for authentication
   */
  credentialId?: string | null;
  /**
   * Messages
   * Tool message configurations
   */
  messages?:
    | (
        | ToolMessageStart
        | ToolMessageComplete
        | ToolMessageFailed
        | ToolMessageDelayed
      )[]
    | null;
  /**
   * Metadata
   * Free-form metadata storage
   */
  metadata?: Record<string, any> | null;
}

/**
 * UpdateApiRequestToolDTO
 * DTO for updating an existing API request tool.
 */
export interface UpdateApiRequestToolDTO {
  /**
   * Type
   * Tool type
   * @default "apiRequest"
   */
  type?: "apiRequest";
  /**
   * Name
   * Tool name
   */
  name?: string | null;
  /**
   * Description
   * Tool description
   */
  description?: string | null;
  /**
   * Method
   * HTTP method
   */
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | null;
  /**
   * Url
   * API endpoint URL
   */
  url?: string | null;
  /** HTTP headers configuration */
  headers?: ApiRequestHeaders | null;
  /** Request body schema */
  body?: ApiRequestBody | null;
  /**
   * Timeoutseconds
   * Request timeout
   */
  timeoutSeconds?: number | null;
  /**
   * Credentialid
   * Credential identifier for authentication
   */
  credentialId?: string | null;
  /**
   * Messages
   * Tool message configurations
   */
  messages?:
    | (
        | ToolMessageStart
        | ToolMessageComplete
        | ToolMessageFailed
        | ToolMessageDelayed
      )[]
    | null;
  /**
   * Metadata
   * Free-form metadata storage
   */
  metadata?: Record<string, any> | null;
}

/**
 * UpdateAssistantDTO
 * DTO for updating an existing assistant.
 */
export interface UpdateAssistantDTO {
  /**
   * Name
   * Assistant name
   */
  name?: string | null;
  /**
   * Transcriber
   * Transcriber configuration
   */
  transcriber?:
    | (
        | ({
            provider: "assembly-ai";
          } & AssemblyAITranscriber)
        | ({
            provider: "azure";
          } & AzureSpeechTranscriber)
        | ({
            provider: "cartesia";
          } & CartesiaTranscriber)
        | ({
            provider: "deepgram";
          } & DeepgramTranscriber)
        | ({
            provider: "openai";
          } & OpenAITranscriber)
        | ({
            provider: "soniox";
          } & SonioxTranscriber)
      )
    | null;
  /**
   * Model
   * AI model configuration
   */
  model?:
    | (
        | ({
            provider: "anthropic";
          } & AnthropicModel)
        | ({
            provider: "custom-llm";
          } & CustomLLMModel)
        | ({
            provider: "google";
          } & GoogleModel)
        | ({
            provider: "openai";
          } & OpenAIModel)
      )
    | null;
  /**
   * Voice
   * Voice synthesis configuration
   */
  voice?:
    | (
        | ({
            provider: "amazon";
          } & AmazonVoice)
        | ({
            provider: "azure";
          } & AzureVoice)
        | ({
            provider: "cartesia";
          } & CartesiaVoice)
        | ({
            provider: "elevenlabs";
          } & ElevenLabsVoice)
        | ({
            provider: "minimax";
          } & MinimaxVoice)
        | ({
            provider: "openai";
          } & OpenAIVoice)
      )
    | null;
  /**
   * Firstmessage
   * Initial message the assistant will say
   */
  firstMessage?: string | null;
  /**
   * Metadata
   * Free-form metadata storage
   */
  metadata?: Record<string, any> | null;
}

/**
 * UpdateCallDTO
 * DTO for updating an existing call.
 */
export interface UpdateCallDTO {
  /**
   * Name
   * Call name
   */
  name?: string | null;
  /**
   * Metadata
   * Free-form metadata
   */
  metadata?: Record<string, any> | null;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

/** WebCallResponse */
export interface WebCallResponse {
  /**
   * Id
   * Call unique identifier
   */
  id: string;
  /**
   * Orgid
   * Organization identifier
   */
  orgId: string;
  /** Call type */
  type: CallType;
  /** Current call status */
  status: CallStatus;
  /**
   * Createdat
   * Creation timestamp
   * @format date-time
   */
  createdAt: string;
  /**
   * Updatedat
   * Last update timestamp
   * @format date-time
   */
  updatedAt: string;
  /**
   * Startedat
   * Call start timestamp
   */
  startedAt?: string | null;
  /**
   * Endedat
   * Call end timestamp
   */
  endedAt?: string | null;
  /**
   * Name
   * Call name
   */
  name?: string | null;
  /**
   * Endedreason
   * Reason call ended
   */
  endedReason?: string | null;
  /**
   * Assistantid
   * Assistant ID reference
   */
  assistantId?: string | null;
  /**
   * Phonenumberid
   * Phone number ID reference
   */
  phoneNumberId?: string | null;
  /**
   * Metadata
   * Free-form metadata
   */
  metadata?: Record<string, any> | null;
  /**
   * Webcallurl
   * Web call url
   */
  webCallUrl: string;
  /**
   * Webcalltoken
   * Web call token
   */
  webCallToken: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title User Authentication API
 * @version 1.0.0
 *
 *
 *     NexAgent API
 *
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Root endpoint
   *
   * @name RootGet
   * @summary Root
   * @request GET:/
   */
  rootGet = (params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/`,
      method: "GET",
      format: "json",
      ...params,
    });

  apiKey = {
    /**
     * @description Create a new API key for an organization with the provided information
     *
     * @tags api-keys
     * @name CreateApiKeyEndpointApiKeyPost
     * @summary Create new API key
     * @request POST:/api-key/
     * @secure
     */
    createApiKeyEndpointApiKeyPost: (
      data: ApiKeyCreate,
      params: RequestParams = {},
    ) =>
      this.request<
        ApiKeyOperationResponse,
        ApiKeyErrorResponse | HTTPValidationError
      >({
        path: `/api-key/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve API key information by API key ID
     *
     * @tags api-keys
     * @name GetApiKeyEndpointApiKeyKeyIdGet
     * @summary Get API key by ID
     * @request GET:/api-key/{key_id}
     * @secure
     */
    getApiKeyEndpointApiKeyKeyIdGet: (
      keyId: string,
      params: RequestParams = {},
    ) =>
      this.request<ApiKeyResponse, ApiKeyErrorResponse | HTTPValidationError>({
        path: `/api-key/${keyId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Revoke (delete) an API key by ID
     *
     * @tags api-keys
     * @name RevokeApiKeyEndpointApiKeyKeyIdDelete
     * @summary Revoke API key
     * @request DELETE:/api-key/{key_id}
     * @secure
     */
    revokeApiKeyEndpointApiKeyKeyIdDelete: (
      keyId: string,
      params: RequestParams = {},
    ) =>
      this.request<
        Record<string, any>,
        ApiKeyErrorResponse | HTTPValidationError
      >({
        path: `/api-key/${keyId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  credential = {
    /**
     * @description Create a new credential with the provided authentication configuration
     *
     * @tags credentials
     * @name CreateCredentialEndpointCredentialPost
     * @summary Create new credential
     * @request POST:/credential/
     * @secure
     */
    createCredentialEndpointCredentialPost: (
      data: CredentialCreate,
      params: RequestParams = {},
    ) =>
      this.request<CredentialResponse, HTTPValidationError>({
        path: `/credential/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve a paginated list of credentials for the authenticated user's organization
     *
     * @tags credentials
     * @name ListCredentialsEndpointCredentialGet
     * @summary List credentials
     * @request GET:/credential/
     * @secure
     */
    listCredentialsEndpointCredentialGet: (
      query?: {
        /**
         * Provider
         * Filter by provider type
         */
        provider?: string | null;
        /**
         * Status
         * Filter by credential status
         */
        status?: CredentialStatus | null;
        /**
         * Limit
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number;
        /** Next Token */
        next_token?: string | null;
        /**
         * Ascending
         * @default false
         */
        ascending?: boolean;
        /** Created At Gt */
        created_at_gt?: string | null;
        /** Created At Ge */
        created_at_ge?: string | null;
        /** Created At Lt */
        created_at_lt?: string | null;
        /** Created At Le */
        created_at_le?: string | null;
        /** Updated At Gt */
        updated_at_gt?: string | null;
        /** Updated At Ge */
        updated_at_ge?: string | null;
        /** Updated At Lt */
        updated_at_lt?: string | null;
        /** Updated At Le */
        updated_at_le?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginationResponseCredentialResponse, HTTPValidationError>({
        path: `/credential/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve credential information by credential ID
     *
     * @tags credentials
     * @name GetCredentialEndpointCredentialCredentialIdGet
     * @summary Get credential by ID
     * @request GET:/credential/{credential_id}
     * @secure
     */
    getCredentialEndpointCredentialCredentialIdGet: (
      credentialId: string,
      params: RequestParams = {},
    ) =>
      this.request<CredentialResponse, HTTPValidationError>({
        path: `/credential/${credentialId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update credential information with the provided data
     *
     * @tags credentials
     * @name UpdateCredentialEndpointCredentialCredentialIdPut
     * @summary Update credential
     * @request PUT:/credential/{credential_id}
     * @secure
     */
    updateCredentialEndpointCredentialCredentialIdPut: (
      credentialId: string,
      data: CredentialUpdate,
      params: RequestParams = {},
    ) =>
      this.request<CredentialResponse, HTTPValidationError>({
        path: `/credential/${credentialId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a credential by ID
     *
     * @tags credentials
     * @name DeleteCredentialEndpointCredentialCredentialIdDelete
     * @summary Delete credential
     * @request DELETE:/credential/{credential_id}
     * @secure
     */
    deleteCredentialEndpointCredentialCredentialIdDelete: (
      credentialId: string,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, HTTPValidationError>({
        path: `/credential/${credentialId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  assistant = {
    /**
     * @description Create a new AI assistant with complex configuration. **Configuration Options:** - **Transcriber**: AssemblyAI, OpenAI Whisper, or Deepgram - **Model**: OpenAI GPT, Anthropic Claude, or Google Gemini - **Voice**: OpenAI TTS, ElevenLabs, or Amazon Polly Each configuration supports provider-specific options like temperature, confidence thresholds, and voice parameters. **Example Request:** ```json { "name": "Customer Support Assistant", "transcriber": { "provider": "assembly-ai", "language": "en", "confidenceThreshold": 0.4 }, "model": { "provider": "openai", "model": "gpt-4", "temperature": 0.7 }, "voice": { "provider": "openai", "voice": "alloy", "speed": 1.0 }, "firstMessage": "Hello! How can I help you today?", "metadata": { "department": "support", "version": "1.0" } } ```
     *
     * @tags assistants
     * @name CreateAssistantEndpointAssistantPost
     * @summary Create Assistant
     * @request POST:/assistant/
     * @secure
     */
    createAssistantEndpointAssistantPost: (
      data: CreateAssistantDTO,
      params: RequestParams = {},
    ) =>
      this.request<AssistantResponse, void | HTTPValidationError>({
        path: `/assistant/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description List all assistants in the organization with pagination
     *
     * @tags assistants
     * @name ListAssistantsEndpointAssistantGet
     * @summary List Assistants
     * @request GET:/assistant/
     * @secure
     */
    listAssistantsEndpointAssistantGet: (
      query?: {
        /**
         * Limit
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number;
        /** Next Token */
        next_token?: string | null;
        /**
         * Ascending
         * @default false
         */
        ascending?: boolean;
        /** Created At Gt */
        created_at_gt?: string | null;
        /** Created At Ge */
        created_at_ge?: string | null;
        /** Created At Lt */
        created_at_lt?: string | null;
        /** Created At Le */
        created_at_le?: string | null;
        /** Updated At Gt */
        updated_at_gt?: string | null;
        /** Updated At Ge */
        updated_at_ge?: string | null;
        /** Updated At Lt */
        updated_at_lt?: string | null;
        /** Updated At Le */
        updated_at_le?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginationResponseAssistantResponse, HTTPValidationError>({
        path: `/assistant/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve a specific assistant by its unique identifier. Returns the complete assistant configuration including: - Basic information (name, creation/update timestamps) - Complex nested configurations (transcriber, model, voice) - Custom metadata and first message **Organization Isolation:** Only returns assistants that belong to the authenticated user's organization. **Example Response:** ```json { "id": "123e4567-e89b-12d3-a456-426614174000", "orgId": "org-123", "name": "Customer Support Assistant", "createdAt": "2025-01-13T10:30:00Z", "updatedAt": "2025-01-13T15:45:00Z", "transcriber": { "provider": "assembly-ai", "language": "en", "confidenceThreshold": 0.4 }, "model": { "provider": "openai", "model": "gpt-4", "temperature": 0.7 }, "voice": { "provider": "openai", "voice": "alloy", "speed": 1.0 }, "firstMessage": "Hello! How can I help you today?", "metadata": { "department": "support", "version": "1.0" } } ```
     *
     * @tags assistants
     * @name GetAssistantEndpointAssistantAssistantIdGet
     * @summary Get Assistant
     * @request GET:/assistant/{assistant_id}
     * @secure
     */
    getAssistantEndpointAssistantAssistantIdGet: (
      assistantId: string,
      params: RequestParams = {},
    ) =>
      this.request<AssistantResponse, void | HTTPValidationError>({
        path: `/assistant/${assistantId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing assistant's configuration
     *
     * @tags assistants
     * @name UpdateAssistantEndpointAssistantAssistantIdPatch
     * @summary Update Assistant
     * @request PATCH:/assistant/{assistant_id}
     * @secure
     */
    updateAssistantEndpointAssistantAssistantIdPatch: (
      assistantId: string,
      data: UpdateAssistantDTO,
      params: RequestParams = {},
    ) =>
      this.request<AssistantResponse, HTTPValidationError>({
        path: `/assistant/${assistantId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete an assistant permanently
     *
     * @tags assistants
     * @name DeleteAssistantEndpointAssistantAssistantIdDelete
     * @summary Delete Assistant
     * @request DELETE:/assistant/{assistant_id}
     * @secure
     */
    deleteAssistantEndpointAssistantAssistantIdDelete: (
      assistantId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/assistant/${assistantId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  call = {
    /**
     * @description Create a new call with comprehensive configuration. **Configuration Options:** - **Assistant**: assistantId must be provided - **Phone Number**: phoneNumberId must be provided (not required for web calls) **Call Types:** - **outboundPhoneCall**: Outbound phone call to customer - **inboundPhoneCall**: Inbound phone call from customer - **webCall**: Web-based call (no phone number required) **Example Call:** ```json { "name": "Customer Support Call", "assistantId": "550e8400-e29b-41d4-a716-446655440001", "phoneNumberId": "phone-456", "type": "outboundPhoneCall", "metadata": { "campaign": "support", "priority": "high" } } ```
     *
     * @tags calls
     * @name CreateCallEndpointCallPost
     * @summary Create Call
     * @request POST:/call/
     * @secure
     */
    createCallEndpointCallPost: (
      data: CreateCallDTO,
      params: RequestParams = {},
    ) =>
      this.request<CallResponse, void | HTTPValidationError>({
        path: `/call/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description List all calls in the organization with filtering and pagination. **Filtering Options:** - **assistantId**: Filter by specific assistant - **phoneNumberId**: Filter by specific phone number - **status**: Filter by call status (queued, ringing, in-progress, ended) - **type**: Filter by call type (inboundPhoneCall, outboundPhoneCall, webCall) **Pagination:** - **limit**: Number of results per page (1-1000, default 100) - **next_token**: Token for retrieving next page - **ascending**: Sort order (false for newest-first, true for oldest-first) **Date Range Filtering:** - **created_at_gt/ge/lt/le**: Filter by creation date - **updated_at_gt/ge/lt/le**: Filter by update date **Example Request:** ``` GET /calls?assistantId=assistant-123&status=ended&limit=50&ascending=false ``` **Example Response:** ```json { "items": [ { "id": "call-123", "type": "outboundPhoneCall", "status": "ended", "createdAt": "2025-01-13T10:30:00Z", "name": "Customer Support Call" } ], "next_token": "eyJwayI6ImNhbCIsInNrIjoiY2FsbC0xMjMifQ==", "total_count": 150 } ```
     *
     * @tags calls
     * @name ListCallsEndpointCallGet
     * @summary List Calls
     * @request GET:/call/
     * @secure
     */
    listCallsEndpointCallGet: (
      query?: {
        /**
         * Limit
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number;
        /** Next Token */
        next_token?: string | null;
        /**
         * Ascending
         * @default false
         */
        ascending?: boolean;
        /** Created At Gt */
        created_at_gt?: string | null;
        /** Created At Ge */
        created_at_ge?: string | null;
        /** Created At Lt */
        created_at_lt?: string | null;
        /** Created At Le */
        created_at_le?: string | null;
        /** Updated At Gt */
        updated_at_gt?: string | null;
        /** Updated At Ge */
        updated_at_ge?: string | null;
        /** Updated At Lt */
        updated_at_lt?: string | null;
        /** Updated At Le */
        updated_at_le?: string | null;
        /** Assistantid */
        assistantId?: string | null;
        /** Phonenumberid */
        phoneNumberId?: string | null;
        /** Status */
        status?: CallStatus | null;
        /** Type */
        type?: CallType | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginationResponseCallResponse, void | HTTPValidationError>({
        path: `/call/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new call with comprehensive configuration. **Configuration Options:** - **Assistant**: assistantId must be provided - **Phone Number**: phoneNumberId must be provided (not required for web calls) **Example Call:** ```json { "name": "Customer Support Call", "assistantId": "550e8400-e29b-41d4-a716-446655440001", "phoneNumberId": "phone-456", "metadata": { "campaign": "support", "priority": "high" } } ```
     *
     * @tags calls
     * @name CreateWebCallEndpointCallWebPost
     * @summary Create Call
     * @request POST:/call/web
     * @secure
     */
    createWebCallEndpointCallWebPost: (
      data: CreateWebCallDTO,
      params: RequestParams = {},
    ) =>
      this.request<WebCallResponse, void | HTTPValidationError>({
        path: `/call/web`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve a specific call by its unique identifier. Returns the complete call information including: - Basic information (name, type, status, timestamps) - Configuration references (assistant, phone number, customer) - Cost breakdown and analytics data - Call artifacts (recordings, transcripts, logs) - Scheduling information and metadata **Organization Isolation:** Only returns calls that belong to the authenticated user's organization. **Example Response:** ```json { "id": "550e8400-e29b-41d4-a716-446655440001", "orgId": "org-123", "type": "outboundPhoneCall", "status": "ended", "createdAt": "2025-01-13T10:30:00Z", "updatedAt": "2025-01-13T10:35:00Z", "startedAt": "2025-01-13T10:30:30Z", "endedAt": "2025-01-13T10:35:00Z", "name": "Customer Support Call", "assistantId": "assistant-123", "phoneNumberId": "phone-456", "customerId": "customer-789", "cost": 0.25, "costBreakdown": { "transport": 0.10, "stt": 0.05, "llm": 0.08, "tts": 0.02, "total": 0.25 }, "artifact": { "recordingUrl": "https://recordings.example.com/call-123.mp3", "transcript": "Hello, how can I help you today?..." } } ```
     *
     * @tags calls
     * @name GetCallEndpointCallCallIdGet
     * @summary Get Call
     * @request GET:/call/{call_id}
     * @secure
     */
    getCallEndpointCallCallIdGet: (
      callId: string,
      params: RequestParams = {},
    ) =>
      this.request<CallResponse, void | HTTPValidationError>({
        path: `/call/${callId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing call's mutable properties. **Updatable Fields:** - **name**: Call display name (max 40 characters) - **metadata**: Free-form metadata dictionary **Immutable Fields:** The following fields cannot be updated after call creation: - id, orgId, type, status - createdAt, startedAt, endedAt - Configuration references (assistantId, phoneNumberId, customerId) - Cost and analytics data (managed by system) **Example Request:** ```json { "name": "Updated Call Name", "metadata": { "priority": "urgent", "notes": "Customer callback requested" } } ``` Only provided fields will be updated. The updatedAt timestamp is automatically set to the current time.
     *
     * @tags calls
     * @name UpdateCallEndpointCallCallIdPatch
     * @summary Update Call
     * @request PATCH:/call/{call_id}
     * @secure
     */
    updateCallEndpointCallCallIdPatch: (
      callId: string,
      data: UpdateCallDTO,
      params: RequestParams = {},
    ) =>
      this.request<CallResponse, void | HTTPValidationError>({
        path: `/call/${callId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a call permanently. The call must belong to the authenticated user's organization. This operation cannot be undone and will remove: - Call record and all associated metadata - References to artifacts (recordings, transcripts, logs) - Cost and analytics data **Note:** This operation does not delete the actual artifact files (recordings, transcripts) from storage. Those may need to be cleaned up separately based on retention policies. **Organization Isolation:** Only calls belonging to the authenticated user's organization can be deleted.
     *
     * @tags calls
     * @name DeleteCallEndpointCallCallIdDelete
     * @summary Delete Call
     * @request DELETE:/call/{call_id}
     * @secure
     */
    deleteCallEndpointCallCallIdDelete: (
      callId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void | HTTPValidationError>({
        path: `/call/${callId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  phoneNumber = {
    /**
     * @description Create a new phone number. Creates a new phone number with Twilio provider credentials. Credentials are encrypted before storage. Args: data: Phone number creation data org_id: Organization ID from auth middleware service: Phone number service dependency Returns: Created phone number response Raises: HTTPException: - 400 if validation fails - 422 if input data is invalid
     *
     * @tags phone-numbers
     * @name CreatePhoneNumberPhoneNumberPost
     * @summary Create Phone Number
     * @request POST:/phone-number
     * @secure
     */
    createPhoneNumberPhoneNumberPost: (
      data: PhoneNumberCreate,
      params: RequestParams = {},
    ) =>
      this.request<PhoneNumberResponse, HTTPValidationError>({
        path: `/phone-number`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description List phone numbers for the organization. Returns a paginated list of phone numbers belonging to the authenticated organization. Args: current_user: Authenticated user from Authorization header pagination: Pagination parameters (limit and next_token) Returns: PaginationResponse with list of phone numbers
     *
     * @tags phone-numbers
     * @name ListPhoneNumbersPhoneNumberGet
     * @summary List Phone Numbers
     * @request GET:/phone-number
     * @secure
     */
    listPhoneNumbersPhoneNumberGet: (
      query?: {
        /**
         * Limit
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number;
        /** Next Token */
        next_token?: string | null;
        /**
         * Ascending
         * @default false
         */
        ascending?: boolean;
        /** Created At Gt */
        created_at_gt?: string | null;
        /** Created At Ge */
        created_at_ge?: string | null;
        /** Created At Lt */
        created_at_lt?: string | null;
        /** Created At Le */
        created_at_le?: string | null;
        /** Updated At Gt */
        updated_at_gt?: string | null;
        /** Updated At Ge */
        updated_at_ge?: string | null;
        /** Updated At Lt */
        updated_at_lt?: string | null;
        /** Updated At Le */
        updated_at_le?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginationResponsePhoneNumberResponse, HTTPValidationError>({
        path: `/phone-number`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get a phone number by ID. Retrieves a phone number by its ID. Only returns phone numbers that belong to the authenticated organization. Args: phone_id: Phone number ID org_id: Organization ID from auth middleware service: Phone number service dependency Returns: Phone number response Raises: HTTPException: - 404 if phone number not found or doesn't belong to org
     *
     * @tags phone-numbers
     * @name GetPhoneNumberPhoneNumberPhoneIdGet
     * @summary Get Phone Number
     * @request GET:/phone-number/{phone_id}
     * @secure
     */
    getPhoneNumberPhoneNumberPhoneIdGet: (
      phoneId: string,
      params: RequestParams = {},
    ) =>
      this.request<PhoneNumberResponse, HTTPValidationError>({
        path: `/phone-number/${phoneId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update a phone number. Updates an existing phone number. Only phone numbers belonging to the authenticated organization can be updated. Args: phone_id: Phone number ID data: Update data org_id: Organization ID from auth middleware service: Phone number service dependency Returns: Updated phone number response Raises: HTTPException: - 400 if validation fails - 404 if phone number not found or doesn't belong to org
     *
     * @tags phone-numbers
     * @name UpdatePhoneNumberPhoneNumberPhoneIdPatch
     * @summary Update Phone Number
     * @request PATCH:/phone-number/{phone_id}
     * @secure
     */
    updatePhoneNumberPhoneNumberPhoneIdPatch: (
      phoneId: string,
      data: PhoneNumberUpdate,
      params: RequestParams = {},
    ) =>
      this.request<PhoneNumberResponse, HTTPValidationError>({
        path: `/phone-number/${phoneId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a phone number. Deletes a phone number. Only phone numbers belonging to the authenticated organization can be deleted. Args: phone_id: Phone number ID org_id: Organization ID from auth middleware service: Phone number service dependency Raises: HTTPException: - 404 if phone number not found or doesn't belong to org
     *
     * @tags phone-numbers
     * @name DeletePhoneNumberPhoneNumberPhoneIdDelete
     * @summary Delete Phone Number
     * @request DELETE:/phone-number/{phone_id}
     * @secure
     */
    deletePhoneNumberPhoneNumberPhoneIdDelete: (
      phoneId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/phone-number/${phoneId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  tool = {
    /**
     * @description Create a new API request tool with complex configuration. **Configuration Options:** - **Method**: HTTP method (GET, POST, PUT, PATCH, DELETE) - **URL**: API endpoint URL for external service integration - **Headers**: HTTP headers configuration with key-value pairs - **Body**: Request body schema for POST/PUT/PATCH requests - **Timeout**: Request timeout in seconds (1-300) - **Credentials**: Optional credential ID for authentication - **Messages**: Tool message configurations for different states **Example Request:** ```json { "type": "apiRequest", "name": "Weather API Tool", "description": "Fetches weather data from external API", "method": "GET", "url": "https://api.weather.com/v1/current", "headers": { "headers": { "Authorization": "Bearer {{api_key}}", "Content-Type": "application/json" } }, "body": { "schema": { "type": "object", "properties": { "query": { "type": "string" } } } }, "timeoutSeconds": 30, "credentialId": "550e8400-e29b-41d4-a716-446655440000", "messages": [ { "type": "request-start", "content": "Fetching weather data...", "blocking": false }, { "type": "request-complete", "content": "Weather data retrieved successfully", "role": "assistant", "endCallAfterSpokenEnabled": false } ], "metadata": { "category": "weather", "version": "1.0" } } ```
     *
     * @tags tools
     * @name CreateToolEndpointToolPost
     * @summary Create Tool
     * @request POST:/tool/
     * @secure
     */
    createToolEndpointToolPost: (
      data: CreateToolDTO,
      params: RequestParams = {},
    ) =>
      this.request<ToolResponse, void | HTTPValidationError>({
        path: `/tool/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description List all tools in the organization with pagination. Returns a paginated list of all API request tools belonging to the authenticated user's organization. Results are sorted by creation time for consistent ordering. **Pagination Support:** - Use `limit` parameter to control page size (1-1000, default: 100) - Use `next_token` from previous response to get next page - Use `ascending` parameter to control sort order (default: newest first) **Date Filtering:** - Filter by creation date using `created_at_*` parameters - Filter by update date using `updated_at_*` parameters - Support both inclusive and exclusive date boundaries **Example Response:** ```json { "items": [ { "id": "123e4567-e89b-12d3-a456-426614174000", "orgId": "org-123", "type": "apiRequest", "name": "Weather API Tool", "description": "Fetches weather data", "createdAt": "2025-01-13T10:30:00Z", "updatedAt": "2025-01-13T15:45:00Z", "method": "GET", "url": "https://api.weather.com/v1/current", "timeoutSeconds": 30, "metadata": { "category": "weather" } } ], "next_token": "eyJwayI6InRvbCIsInNrIjoiMTIzZTQ1NjcifQ==", "total_count": null } ```
     *
     * @tags tools
     * @name ListToolsEndpointToolGet
     * @summary List Tools
     * @request GET:/tool/
     * @secure
     */
    listToolsEndpointToolGet: (
      query?: {
        /**
         * Limit
         * @min 1
         * @max 1000
         * @default 100
         */
        limit?: number;
        /** Next Token */
        next_token?: string | null;
        /**
         * Ascending
         * @default false
         */
        ascending?: boolean;
        /** Created At Gt */
        created_at_gt?: string | null;
        /** Created At Ge */
        created_at_ge?: string | null;
        /** Created At Lt */
        created_at_lt?: string | null;
        /** Created At Le */
        created_at_le?: string | null;
        /** Updated At Gt */
        updated_at_gt?: string | null;
        /** Updated At Ge */
        updated_at_ge?: string | null;
        /** Updated At Lt */
        updated_at_lt?: string | null;
        /** Updated At Le */
        updated_at_le?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<PaginationResponseToolResponse, void | HTTPValidationError>({
        path: `/tool/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve a specific tool by its unique identifier. Returns the complete tool configuration including: - Basic information (name, description, creation/update timestamps) - HTTP configuration (method, URL, headers, body schema) - Timeout and credential settings - Tool message configurations for different states - Custom metadata **Organization Isolation:** Only returns tools that belong to the authenticated user's organization. **Example Response:** ```json { "id": "123e4567-e89b-12d3-a456-426614174000", "orgId": "org-123", "type": "apiRequest", "name": "Weather API Tool", "description": "Fetches weather data from external API", "createdAt": "2025-01-13T10:30:00Z", "updatedAt": "2025-01-13T15:45:00Z", "method": "GET", "url": "https://api.weather.com/v1/current", "headers": { "headers": { "Authorization": "Bearer {{api_key}}", "Content-Type": "application/json" } }, "body": { "schema": { "type": "object", "properties": { "query": { "type": "string" } } } }, "timeoutSeconds": 30, "credentialId": "550e8400-e29b-41d4-a716-446655440000", "messages": [ { "type": "request-start", "content": "Fetching weather data...", "blocking": false }, { "type": "request-complete", "content": "Weather data retrieved successfully", "role": "assistant", "endCallAfterSpokenEnabled": false } ], "metadata": { "category": "weather", "version": "1.0" } } ```
     *
     * @tags tools
     * @name GetToolEndpointToolToolIdGet
     * @summary Get Tool
     * @request GET:/tool/{tool_id}
     * @secure
     */
    getToolEndpointToolToolIdGet: (
      toolId: string,
      params: RequestParams = {},
    ) =>
      this.request<ToolResponse, void | HTTPValidationError>({
        path: `/tool/${toolId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update an existing tool's configuration with partial updates. Only provided fields will be updated. Complex configurations (headers, body schema, messages) can be updated independently. **Updatable Fields:** - Basic information: name, description - HTTP configuration: method, url, headers, body - Settings: timeoutSeconds, credentialId - Messages: tool message configurations - Metadata: custom metadata storage **Example Request:** ```json { "name": "Updated Weather Tool", "description": "Enhanced weather data fetching tool", "timeoutSeconds": 60, "headers": { "headers": { "Authorization": "Bearer {{new_api_key}}", "Content-Type": "application/json", "User-Agent": "NexAgent/1.0" } }, "messages": [ { "type": "request-start", "content": "Fetching updated weather data...", "blocking": false } ], "metadata": { "category": "weather", "version": "2.0", "updated": true } } ```
     *
     * @tags tools
     * @name UpdateToolEndpointToolToolIdPatch
     * @summary Update Tool
     * @request PATCH:/tool/{tool_id}
     * @secure
     */
    updateToolEndpointToolToolIdPatch: (
      toolId: string,
      data: UpdateToolDTO,
      params: RequestParams = {},
    ) =>
      this.request<ToolResponse, void | HTTPValidationError>({
        path: `/tool/${toolId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a tool permanently. The tool must belong to the authenticated user's organization. This operation cannot be undone. **Security:** - Organization isolation enforced - Audit logging for compliance tracking - Authorization verification before deletion **Response:** - 204 No Content: Tool deleted successfully - 404 Not Found: Tool not found or not accessible - 401 Unauthorized: Authentication required
     *
     * @tags tools
     * @name DeleteToolEndpointToolToolIdDelete
     * @summary Delete Tool
     * @request DELETE:/tool/{tool_id}
     * @secure
     */
    deleteToolEndpointToolToolIdDelete: (
      toolId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void | HTTPValidationError>({
        path: `/tool/${toolId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  webhook = {
    /**
     * @description Handle Twilio voice webhook for starting calls with assistants. This endpoint receives Twilio webhook calls when a phone number is dialed. It processes the call and initiates the appropriate assistant conversation. Args: request: FastAPI request object assistant_id: Assistant ID from query parameter Returns: TwiML response to control the call
     *
     * @tags webhooks
     * @name StartTwilioWebhookWebhookTwilioPhonePost
     * @summary Start Twilio Webhook
     * @request POST:/webhook/twilio-phone
     */
    startTwilioWebhookWebhookTwilioPhonePost: (
      query?: {
        /** Assistant Id */
        assistant_id?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/webhook/twilio-phone`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Handle incoming Twilio call webhook. This endpoint: 1. Receives Twilio webhook data for incoming calls 2. Creates a Daily room with SIP capabilities 3. Starts the bot (locally or via Pipecat Cloud based on ENV) 4. Returns TwiML to put caller on hold while bot connects Returns: TwiML response with hold music for the caller
     *
     * @tags webhooks
     * @name HandleCallWebhookTwilioSipPost
     * @summary Handle Call
     * @request POST:/webhook/twilio-sip
     */
    handleCallWebhookTwilioSipPost: (params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/webhook/twilio-sip`,
        method: "POST",
        ...params,
      }),
  };
  health = {
    /**
     * @description Health check endpoint for application monitoring. Performs comprehensive health checks including: - Application status - Repository connectivity (DynamoDB, S3) - Configuration validation Returns: Dict containing health status and detailed information
     *
     * @name HealthCheckHealthGet
     * @summary Health Check
     * @request GET:/health
     */
    healthCheckHealthGet: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/health`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
