import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateHoverState = (e) => {
      const target = e.target;
      // Check if we're hovering over text, buttons, links, or inputs
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'input' ||
        target.tagName.toLowerCase() === 'h1' ||
        target.tagName.toLowerCase() === 'h2' ||
        target.tagName.toLowerCase() === 'h3' ||
        target.tagName.toLowerCase() === 'p' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', updateHoverState);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateHoverState);
    };
  }, []);

  return (
    <>
      <div
        className={`fixed pointer-events-none z-[9999] rounded-full mix-blend-difference transition-transform duration-300 ease-out flex items-center justify-center`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 4 : 1})`,
          width: '20px',
          height: '20px',
          backgroundColor: 'white',
        }}
      />
      <style jsx global>{`
        body {
          cursor: none; /* Hide the default cursor to show our custom one */
        }
        /* Except for inputs where we might want the text cursor, though difference blend mode looks cool there too */
      `}</style>
    </>
  );
}
