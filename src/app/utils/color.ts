  export const generateBlueColor = (index: number, total: number) => {
    const blueHueStart = 200;
    const blueHueEnd = 240;
    const hue = blueHueStart + ((blueHueEnd - blueHueStart) * index / Math.max(total - 1, 1));
    return `hsl(${hue}, 85%, 60%)`;
  };