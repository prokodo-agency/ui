import {
  handleMouseDown,
  handleMouseUp,
  handleTouchEnd,
  handleTouchMove,
  handleTouchStart,
  NEXT,
  PREV,
} from "./Carousel.services"

describe("Carousel.services", () => {
  describe("constants", () => {
    it("exports NEXT and PREV", () => {
      expect(NEXT).toBe("NEXT")
      expect(PREV).toBe("PREV")
    })
  })

  describe("handleTouchStart", () => {
    it("sets touchStartX from first touch", () => {
      const ref = { current: 0 }
      const event = {
        targetTouches: [{ clientX: 120 }],
      } as unknown as React.TouchEvent<HTMLDivElement>
      handleTouchStart(event, ref)
      expect(ref.current).toBe(120)
    })

    it("defaults to 0 when no touches", () => {
      const ref = { current: 999 }
      const event = {
        targetTouches: [],
      } as unknown as React.TouchEvent<HTMLDivElement>
      handleTouchStart(event, ref)
      expect(ref.current).toBe(0)
    })
  })

  describe("handleTouchMove", () => {
    it("sets touchEndX from first touch", () => {
      const ref = { current: 0 }
      const event = {
        targetTouches: [{ clientX: 200 }],
      } as unknown as React.TouchEvent<HTMLDivElement>
      handleTouchMove(event, ref)
      expect(ref.current).toBe(200)
    })

    it("defaults to 0 when no touches", () => {
      const ref = { current: 999 }
      const event = {
        targetTouches: [],
      } as unknown as React.TouchEvent<HTMLDivElement>
      handleTouchMove(event, ref)
      expect(ref.current).toBe(0)
    })
  })

  describe("handleTouchEnd", () => {
    it("slides NEXT when swipe left > 50px", () => {
      const slide = jest.fn()
      handleTouchEnd({ current: 200 }, { current: 100 }, slide)
      expect(slide).toHaveBeenCalledWith("NEXT")
    })

    it("slides PREV when swipe right > 50px", () => {
      const slide = jest.fn()
      handleTouchEnd({ current: 100 }, { current: 200 }, slide)
      expect(slide).toHaveBeenCalledWith("PREV")
    })

    it("does not slide for small swipe", () => {
      const slide = jest.fn()
      handleTouchEnd({ current: 100 }, { current: 110 }, slide)
      expect(slide).not.toHaveBeenCalled()
    })
  })

  describe("handleMouseDown", () => {
    it("sets mouseStartX from clientX", () => {
      const ref = { current: 0 }
      const event = {
        clientX: 300,
      } as unknown as React.MouseEvent<HTMLDivElement>
      handleMouseDown(event, ref)
      expect(ref.current).toBe(300)
    })
  })

  describe("handleMouseUp", () => {
    it("slides NEXT when drag left > 50px", () => {
      const slide = jest.fn()
      const event = {
        clientX: 100,
      } as unknown as React.MouseEvent<HTMLDivElement>
      handleMouseUp(event, { current: 200 }, { current: 0 }, slide)
      expect(slide).toHaveBeenCalledWith("NEXT")
    })

    it("slides PREV when drag right > 50px", () => {
      const slide = jest.fn()
      const event = {
        clientX: 200,
      } as unknown as React.MouseEvent<HTMLDivElement>
      handleMouseUp(event, { current: 100 }, { current: 0 }, slide)
      expect(slide).toHaveBeenCalledWith("PREV")
    })

    it("does not slide for small drag", () => {
      const slide = jest.fn()
      const event = {
        clientX: 105,
      } as unknown as React.MouseEvent<HTMLDivElement>
      handleMouseUp(event, { current: 100 }, { current: 0 }, slide)
      expect(slide).not.toHaveBeenCalled()
    })
  })
})
