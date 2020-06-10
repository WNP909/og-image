import { readFileSync } from "fs";
import marked from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest, BackgroundType } from "./types";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const lightAleo = readFileSync(
  `${__dirname}/../_fonts/aleo-light.woff`
).toString("base64");
const regularAleo = readFileSync(
  `${__dirname}/../_fonts/aleo-regular.woff`
).toString("base64");
const boldAleo = readFileSync(`${__dirname}/../_fonts/aleo-bold.woff`).toString(
  "base64"
);

function getCss(
  theme: string,
  fontSize: string,
  backgroundType: BackgroundType,
  backgroundImage: string
) {
  let background = "white";
  let foreground = "#292a2c";
  let radial = "lightgray";

  if (theme === "dark") {
    background = "#292a2c";
    foreground = "white";
    radial = "dimgray";
  }

  return `
    @font-face {
      font-family: 'Aleo';
      font-style: normal;
      font-weight: 300;
      font-display: swap;
      src: url(data:font/woff;charset=utf-8;base64,${lightAleo}) format('woff');
      unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }

    @font-face {
      font-family: 'Aleo';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url(data:font/woff;charset=utf-8;base64,${regularAleo}) format('woff');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    @font-face {
      font-family: 'Aleo';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: url(data:font/woff;charset=utf-8;base64,${boldAleo}) format('woff');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    body {
        background: ${background};
        ${
          backgroundType === "image" && backgroundImage
            ? `background-image: url(${backgroundImage});`
            : ""
        }
        ${
          backgroundType === "image" && backgroundImage
            ? "background-size: cover;"
            : ""
        }
        ${
          backgroundType === "image" && backgroundImage
            ? "background-position: center;"
            : ""
        }
        ${
          backgroundType === "radial"
            ? `background-image: radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%);`
            : ""
        }
        ${backgroundType === "radial" ? "background-size: 100px 100px;" : ""}
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        font-family: 'Aleo', serif;
        font-style: normal;
    }

    code {
        color: #D400FF;
        
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Aleo', serif;
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
    }
    
    .wnp-title {
      font-size: 100px;
    }

    .wnp-content {
      font-size: ${sanitizeHtml(fontSize)};
    }

    strong {
      color: rgb(255, 181, 0);
      font-weight: 700;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
  const {
    text,
    theme,
    md,
    fontSize,
    logo,
    logoWidth,
    logoHeight,
    backgroundType,
    backgroundImage,
  } = parsedReq;
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize, backgroundType, backgroundImage)}
    </style>
    <body>
        <div>
            <div class="logo-wrapper">
              ${getImage(logo, logoWidth, logoHeight)}
            </div>
            <div class="heading">
              <span class="wnp-title"><strong>What's Next</strong> Partners.</span>
              <span class="wnp-content">${emojify(
                md ? marked(text) : sanitizeHtml(text)
              )}</span>
            </div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width = "auto", height = "225") {
  return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`;
}
