'use client';

import * as React from 'react';

interface ThemeInjectorProps {
  css: string;
}

export function ThemeInjector({ css }: ThemeInjectorProps) {
  const styleRef = React.useRef<HTMLStyleElement>(null);

  React.useEffect(() => {
    if (styleRef.current) {
      styleRef.current.textContent = css;
    }
  }, [css]);

  return <style ref={styleRef} dangerouslySetInnerHTML={{ __html: css }} />;
}
