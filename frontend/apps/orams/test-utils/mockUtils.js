export const getMockCall = (mockFn, callNumber) => mockFn.mock.calls[callNumber]
export const getMockCallArg = (mockFn, callNumber, argNumber) => mockFn.mock.calls[callNumber][argNumber]
