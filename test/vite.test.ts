import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { build } from "vite";
import glob from "fast-glob";
import litCss from "../src";

async function getCode(file: string) {
  const bundle = (await build({
    plugins: [
      litCss()
    ],
    build: {
      lib: {
        entry: file,
        formats: ["es"],
      },
      rollupOptions: {
        external: [/^lit/, /^@lit/],
      },
    },
  })) as any;

  const [output] = bundle
  return output.output
    .map((file: any) => {
      if (file.type === "chunk") {
        return `//${file.fileName}\n${file.code}`;
      } else {
        return file.fileName;
      }
    })
    .join("\n");
}

describe("litcss plugin", () => {
  describe("fixtures", async () => {
    const root = resolve(__dirname, "..");
    const files = await glob("test/fixtures/*.ts", {
      cwd: root,
      onlyFiles: true,
    });

    for (const file of files) {
      describe(file.replaceAll("\\", "/"), async () => {
        const filepath = resolve(root, file);

        for (const isProduction of [true, false]) {
          it(`isProduction is ${isProduction}`, async () => {
            process.env.NODE_ENV = isProduction ? "production" : "development";

            const code = await getCode(file);
            expect(
              code.replaceAll(JSON.stringify(filepath), "'#FILE#'")
            ).toMatchSnapshot();
          });
        }
      });
    }
  });
});
