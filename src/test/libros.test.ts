import { describe, expect, it } from "vitest";
import { formatearISBN, isbnValido } from "@/lib/libros";

describe("ISBN rules", () => {
  it("accepts a valid ISBN-13", () => expect(isbnValido("978-0307474728")).toBe(true));
  it("rejects an ISBN-13 with a wrong check digit", () => expect(isbnValido("9780307474729")).toBe(false));
  it("accepts a valid ISBN-10 ending in X", () => expect(isbnValido("080442957X")).toBe(true));
  it("formats ISBN-13 as prefix-body-check", () => expect(formatearISBN("9780307474728")).toBe("978-030747472-8"));
});
