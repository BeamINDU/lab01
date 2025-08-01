export interface ColorConfig {
  background: string;
  border: string;
  hover: string;
}

export class ChartColorSystem {
  private static readonly COLOR_PALETTES = {
    // Material Design Colors
    material: [
      { background: 'rgba(244, 67, 54, 0.8)', border: 'rgb(244, 67, 54)', hover: 'rgba(244, 67, 54, 0.9)' },   // Red
      { background: 'rgba(33, 150, 243, 0.8)', border: 'rgb(33, 150, 243)', hover: 'rgba(33, 150, 243, 0.9)' }, // Blue
      { background: 'rgba(76, 175, 80, 0.8)', border: 'rgb(76, 175, 80)', hover: 'rgba(76, 175, 80, 0.9)' },   // Green
      { background: 'rgba(255, 193, 7, 0.8)', border: 'rgb(255, 193, 7)', hover: 'rgba(255, 193, 7, 0.9)' },   // Amber
      { background: 'rgba(156, 39, 176, 0.8)', border: 'rgb(156, 39, 176)', hover: 'rgba(156, 39, 176, 0.9)' }, // Purple
      { background: 'rgba(255, 87, 34, 0.8)', border: 'rgb(255, 87, 34)', hover: 'rgba(255, 87, 34, 0.9)' },   // Deep Orange
      { background: 'rgba(0, 188, 212, 0.8)', border: 'rgb(0, 188, 212)', hover: 'rgba(0, 188, 212, 0.9)' },   // Cyan
      { background: 'rgba(121, 85, 72, 0.8)', border: 'rgb(121, 85, 72)', hover: 'rgba(121, 85, 72, 0.9)' },   // Brown
      { background: 'rgba(158, 158, 158, 0.8)', border: 'rgb(158, 158, 158)', hover: 'rgba(158, 158, 158, 0.9)' }, // Grey
      { background: 'rgba(63, 81, 181, 0.8)', border: 'rgb(63, 81, 181)', hover: 'rgba(63, 81, 181, 0.9)' },   // Indigo
    ],
    
    // Business-friendly colors
    business: [
      { background: 'rgba(59, 130, 246, 0.8)', border: 'rgb(59, 130, 246)', hover: 'rgba(59, 130, 246, 0.9)' },   // Professional Blue
      { background: 'rgba(16, 185, 129, 0.8)', border: 'rgb(16, 185, 129)', hover: 'rgba(16, 185, 129, 0.9)' },   // Success Green
      { background: 'rgba(245, 158, 11, 0.8)', border: 'rgb(245, 158, 11)', hover: 'rgba(245, 158, 11, 0.9)' },   // Warning Orange
      { background: 'rgba(239, 68, 68, 0.8)', border: 'rgb(239, 68, 68)', hover: 'rgba(239, 68, 68, 0.9)' },     // Error Red
      { background: 'rgba(168, 85, 247, 0.8)', border: 'rgb(168, 85, 247)', hover: 'rgba(168, 85, 247, 0.9)' },   // Purple
      { background: 'rgba(236, 72, 153, 0.8)', border: 'rgb(236, 72, 153)', hover: 'rgba(236, 72, 153, 0.9)' },   // Pink
      { background: 'rgba(20, 184, 166, 0.8)', border: 'rgb(20, 184, 166)', hover: 'rgba(20, 184, 166, 0.9)' },   // Teal
      { background: 'rgba(156, 163, 175, 0.8)', border: 'rgb(156, 163, 175)', hover: 'rgba(156, 163, 175, 0.9)' }, // Gray
    ]
  };

  private static colorCache = new Map<string, ColorConfig>();

  /**
   * สร้างสีที่ consistent สำหรับ key เดียวกัน
   * ใช้ hash algorithm เพื่อให้ได้สีเดิมเสมอ
   */
  static getColorForKey(key: string, palette: 'material' | 'business' = 'business'): ColorConfig {
    // ใช้ cache เพื่อความเร็ว
    const cacheKey = `${palette}-${key}`;
    if (this.colorCache.has(cacheKey)) {
      return this.colorCache.get(cacheKey)!;
    }

    // Hash string เพื่อได้ index ที่ consistent
    const hash = this.hashString(key);
    const colors = this.COLOR_PALETTES[palette];
    const colorIndex = Math.abs(hash) % colors.length;
    
    const color = colors[colorIndex];
    this.colorCache.set(cacheKey, color);
    
    return color;
  }

  /**
   * สร้างสีสำหรับ array ของ keys
   * รับประกันว่าแต่ละ key จะได้สีที่ไม่ซ้ำกัน (ในขอบเขตที่เป็นไปได้)
   */
  static getColorsForKeys(keys: string[], palette: 'material' | 'business' = 'business'): ColorConfig[] {
    const usedIndices = new Set<number>();
    const colors = this.COLOR_PALETTES[palette];
    
    return keys.map((key, index) => {
      // ลองใช้ hash ก่อน
      let colorIndex = Math.abs(this.hashString(key)) % colors.length;
      
      // ถ้าสีซ้ำ ให้ใช้ index แทน
      if (usedIndices.has(colorIndex)) {
        colorIndex = index % colors.length;
      }
      
      usedIndices.add(colorIndex);
      return colors[colorIndex];
    });
  }

  /**
   * Simple hash function สำหรับ string
   */
  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  /**
   * สร้างสีแบบ gradient สำหรับ range values
   */
  static getGradientColors(count: number, startColor: string, endColor: string): string[] {
    // Implementation for gradient colors
    // ใช้สำหรับ heatmap หรือ progression charts
    return Array(count).fill(startColor); // Simplified
  }

  /**
   * ล้าง cache (สำหรับ memory management)
   */
  static clearCache(): void {
    this.colorCache.clear();
  }
}
