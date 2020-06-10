import { IncomingMessage } from "http";
import { parse } from "url";
import { ParsedRequest, Theme, BackgroundType } from "./types";

export function parseRequest(req: IncomingMessage) {
  console.log("HTTP " + req.url);
  const { pathname, query } = parse(req.url || "/", true);
  const {
    fontSize,
    logo,
    logoWidth,
    logoHeight,
    backgroundType,
    backgroundImage,
    theme,
    md,
  } = query || {};

  if (Array.isArray(fontSize)) {
    throw new Error("Expected a single fontSize");
  }
  if (Array.isArray(theme)) {
    throw new Error("Expected a single theme");
  }

  if (Array.isArray(logo)) {
    throw new Error("Expected a single logo");
  }

  if (Array.isArray(logoWidth)) {
    throw new Error("Expected a single logo width");
  }

  if (Array.isArray(logoHeight)) {
    throw new Error("Expected a single logo height");
  }

  if (Array.isArray(backgroundType)) {
    throw new Error("Expected a single background type");
  }

  if (Array.isArray(backgroundImage)) {
    throw new Error("Expected a single background image");
  }

  const arr = (pathname || "/").slice(1).split(".");
  let extension = "";
  let text = "";
  if (arr.length === 0) {
    text = "";
  } else if (arr.length === 1) {
    text = arr[0];
  } else {
    extension = arr.pop() as string;
    text = arr.join(".");
  }

  const parsedRequest: ParsedRequest = {
    fileType: extension === "jpeg" ? extension : "png",
    text: decodeURIComponent(text),
    theme: theme === "dark" ? "dark" : "light",
    md: md === "1" || md === "true",
    fontSize: fontSize || "96px",
    logo,
    logoWidth,
    logoHeight,
    backgroundType: <BackgroundType>backgroundType || "color",
    backgroundImage: backgroundImage || "",
  };
  parsedRequest.logo = getDefaultLogo(parsedRequest.logo, parsedRequest.theme);

  // parsedRequest.images = getDefaultImages(parsedRequest.images, parsedRequest.theme);
  return parsedRequest;
}

function getDefaultLogo(logo: string, theme: Theme): string {
  const defaultImage =
    theme === "light"
      ? "https://assets.vercel.com/image/upload/front/assets/design/vercel-triangle-black.svg"
      : "https://assets.vercel.com/image/upload/front/assets/design/vercel-triangle-white.svg";

  if (!logo) {
    return defaultImage;
  }

  return logo;
}
