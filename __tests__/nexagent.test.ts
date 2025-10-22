import NexAgent from "../nexagent"; // Adjust the import path based on your project structure

describe("NexAgent", () => {
  let nexAgent: NexAgent;
  let mockCall: any;

  beforeEach(() => {
    // Mock the DailyCall object
    mockCall = {
      setLocalAudio: jest.fn(),
      localAudio: jest.fn(),
    };
    // Initialize NexAgent instance and inject the mock
    nexAgent = new NexAgent("dummy_token");
    nexAgent["call"] = mockCall; // Assuming you have a way to set this for testing
  });

  describe("setMuted", () => {
    it("should mute the audio", () => {
      nexAgent["setMuted"](true);
      expect(mockCall.setLocalAudio).toHaveBeenCalledWith(false);
    });

    it("should unmute the audio", () => {
      nexAgent["setMuted"](false);
      expect(mockCall.setLocalAudio).toHaveBeenCalledWith(true);
    });

    it("should handle errors when call object is not available", () => {
      nexAgent["call"] = null; // Simulate call object not being available
      expect(() => nexAgent["setMuted"](true)).toThrow(
        "Call object is not available."
      );
    });
  });

  describe("isMuted", () => {
    it("should return false if false", () => {
      mockCall.localAudio.mockReturnValue(false); // Initially not muted
      const res = nexAgent.isMuted();
      expect(res).toBe(true);
    });

    it("should return true if true", () => {
      mockCall.localAudio.mockReturnValue(true); // Initially not muted
      const res = nexAgent.isMuted();
      expect(res).toBe(false);
    });

    it("should return false if no call in progress", () => {
      nexAgent["call"] = null; // Simulate call object not being available
      const res = nexAgent.isMuted();
      expect(res).toBe(false);
    });
  });
});
