"use client";
import { FC, useEffect, useState } from "react";
import Highlight, { defaultProps, type Language } from "prism-react-renderer";
import { useTheme } from "next-themes";
import lightTheme from "prism-react-renderer/themes/nightOwlLight";
import darkTheme from "prism-react-renderer/themes/nightOwl";

interface CodeProps {
  code: string;
  show: boolean;
  language: Language;
  animationDelay?: number;
  animated?: boolean;
}

const Code: FC<CodeProps> = ({
  code,
  show,
  language,
  animated,
  animationDelay,
}) => {
  const { theme: AppTheme } = useTheme();
  const [text, setText] = useState(animated ? "" : code);

  useEffect(() => {
    if (show && animated) {
      let i = 0;
      setTimeout(() => {
        const intervalId = setInterval(() => {
          setText(code.slice(0, i));
          i++;
          if (i > code.length) clearInterval(intervalId);
        }, 15);
        return () => {
          clearInterval(intervalId);
        };
      }, animationDelay || 150);
    }
  }, [code, animated, animationDelay, show]);

  const lines = text.split(/\r\n|\r|\n/).length;

  const theme = AppTheme === "light" ? lightTheme : darkTheme;

  return (
    <Highlight {...defaultProps} code={text} language={language} theme={theme}>
      {({ className, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={
            className +
            "transition-all w-fit bg-transparent duration-100 py-0 no-scrollbar"
          }
          style={{
            maxHeight: show ? lines * 24 : 0,
            opacity: show ? 1 : 0,
          }}
        >
          {tokens.map((line, idx) => {
            const { key, ...rest } = getLineProps({ line, key: idx });

            return (
              <div
                key={`line-${idx}`}
                style={{ position: "relative" }}
                {...rest}
              >
                {line.map((token, index) => {
                  const { key, ...props } = getTokenProps({ token, index });

                  return <span key={index} {...props}></span>;
                })}
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
};

export default Code;
