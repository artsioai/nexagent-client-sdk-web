import NextAgent from "../nextagent"; // Adjust the import path based on your project structure

describe("NextAgent", () => {
  let nextAgent: NextAgent;
  let mockCall: any;

  beforeEach(() => {
    // Mock the DailyCall object
    mockCall = {
      setLocalAudio: jest.fn(),
      localAudio: jest.fn(),
    };
    // Initialize NextAgent instance and inject the mock
    nextAgent = new NextAgent("dummy_token");
    nextAgent["call"] = mockCall; // Assuming you have a way to set this for testing
  });

  describe("setMuted", () => {
    it("should mute the audio", () => {
      nextAgent["setMuted"](true);
      expect(mockCall.setLocalAudio).toHaveBeenCalledWith(false);
    });

    it("should unmute the audio", () => {
      nextAgent["setMuted"](false);
      expect(mockCall.setLocalAudio).toHaveBeenCalledWith(true);
    });

    it("should handle errors when call object is not available", () => {
      nextAgent["call"] = null; // Simulate call object not being available
      expect(() => nextAgent["setMuted"](true)).toThrow(
        "Call object is not available."
      );
    });
  });

  describe("isMuted", () => {
    it("should return false if false", () => {
      mockCall.localAudio.mockReturnValue(false); // Initially not muted
      const res = nextAgent.isMuted();
      expect(res).toBe(true);
    });

    it("should return true if true", () => {
      mockCall.localAudio.mockReturnValue(true); // Initially not muted
      const res = nextAgent.isMuted();
      expect(res).toBe(false);
    });

    it("should return false if no call in progress", () => {
      nextAgent["call"] = null; // Simulate call object not being available
      const res = nextAgent.isMuted();
      expect(res).toBe(false);
    });
  });
});
