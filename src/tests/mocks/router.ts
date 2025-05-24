import { jest } from "@jest/globals"
import { useRouter } from "next/navigation"

type RouterType = ReturnType<typeof useRouter>

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

export function mockRouter(mockedRouter: RouterType): void {
  ;(useRouter as jest.Mock).mockReturnValue(mockedRouter)
}
