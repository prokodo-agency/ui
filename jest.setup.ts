(globalThis as any).__PACKAGE_VERSION__ = "0.0.17"
// Import necessary utilities
import { TextDecoder, TextEncoder } from "util"

// Import jest-dom for better assertions on the DOM
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/jest-globals"
// Mock canvas for testing components using canvas
import "jest-canvas-mock"

// Assign global variables for TextEncoder/Decoder
Object.assign(global, { TextDecoder, TextEncoder })
