"""
Aukat Check — SVG Logo Generator
Generates clean, stylish SVG vector logos for all 50 companies in public/logos/{slug}.svg.
Each SVG uses authentic brand colors and modern iconography/typography.
"""

import os
import json

LOGOS = {
    "apple": {
        "bg": "#000000", "fg": "#FFFFFF", "accent": "#A2AAAD",
        "text": "", "sub": "Apple",
        "svg": '<path d="M70 45c-2-3-4-4-7-4-5 0-9 4-12 4-3 0-7-4-11-4-8 0-16 6-16 19 0 13 11 31 18 31 4 0 7-3 11-3s7 3 11 3c8 0 13-9 16-14-6-4-8-10-8-16 0-8 6-13 8-14zM57 32c3-4 5-9 4-14-4 0-9 3-12 6-3 3-5 8-4 13 5 0 9-2 12-5z" fill="#FFFFFF"/>'
    },
    "microsoft": {
        "bg": "#0F0F10", "fg": "#FFFFFF", "accent": "#00A4EF",
        "svg": '<rect x="30" y="30" width="18" height="18" fill="#F25022"/><rect x="52" y="30" width="18" height="18" fill="#7FBA00"/><rect x="30" y="52" width="18" height="18" fill="#00A4EF"/><rect x="52" y="52" width="18" height="18" fill="#FFB900"/>'
    },
    "alphabet": {
        "bg": "#111827", "fg": "#FFFFFF",
        "svg": '<path d="M68 47c0-2-0.2-4-0.6-6H50v11.5h10.1c-0.4 2.4-1.8 4.4-3.8 5.8v4.8h6.2c3.6-3.3 5.7-8.2 5.7-16.1z" fill="#4285F4"/><path d="M50 66c4.3 0 8-1.4 10.6-3.9l-6.2-4.8c-1.4 1-3.3 1.6-4.4 1.6-4.1 0-7.6-2.8-8.8-6.5h-6.4v5C47.4 62.4 43.4 66 50 66z" fill="#34A853"/><path d="M41.2 52.4c-0.3-1-0.5-2.1-0.5-3.4 0-1.2 0.2-2.3 0.5-3.4v-5h-6.4C33.8 43 33 45.9 33 49s0.8 6 2.4 8.4l5.8-5z" fill="#FBBC05"/><path d="M50 34c2.4 0 4.5 0.8 6.2 2.4l4.6-4.6C58 29.4 54.3 28 50 28c-6.6 0-12.4 3.6-15.4 8.6l6.4 5c1.2-3.7 4.7-6.6 9-6.6z" fill="#EA4335"/>'
    },
    "amazon": {
        "bg": "#131921", "fg": "#FF9900",
        "svg": '<path d="M30 45c0-6 5-10 12-10 4 0 7 1 9 3v-2c0-3-2-5-6-5-3 0-5 1-7 2l-2-4c3-2 7-3 11-3 7 0 11 4 11 11v17h-6v-3c-2 2-5 4-9 4-6 0-10-4-10-10zm17-2v-3c-1-1-3-2-5-2-3 0-5 2-5 5 0 3 2 4 5 4 3 0 5-2 5-4z" fill="#FFFFFF"/><path d="M28 66c12 5 28 5 42-2 1-1 2 0 1 1-3 4-10 8-22 8-12 0-19-4-22-6 0-1 0-1 1-1z" fill="#FF9900"/><path d="M68 62l4 2-2-5 3 1-5 2z" fill="#FF9900"/>'
    },
    "nvidia": {
        "bg": "#040D04", "fg": "#76B900",
        "svg": '<path d="M35 30c8-4 22-4 30 2 6 5 8 13 6 20-3 9-12 15-21 15-7 0-14-3-17-9v8h-6V30h6v8c2-3 7-6 12-6 7 0 14 4 15 11 1 8-5 15-13 15-5 0-10-3-12-7 1 3 4 5 7 5 5 0 9-4 9-9 0-4-3-8-8-8-4 0-7 2-8 5v-9z" fill="#76B900"/><rect x="25" y="25" width="50" height="50" rx="10" fill="none" stroke="#76B900" stroke-width="3"/>'
    },
    "meta": {
        "bg": "#06142E", "fg": "#0081FB",
        "svg": '<path d="M32 40c-4-5-9-7-13-4-5 4-5 12 0 16 4 4 9 4 14-2l14-16c4-5 9-7 13-4 5 4 5 12 0 16-4 4-9 4-14-2L32 40z" fill="none" stroke="#0081FB" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'
    },
    "tesla": {
        "bg": "#111111", "fg": "#E82127",
        "svg": '<path d="M50 30c-10 0-20 2-25 5l3 5c5-2 13-4 22-4 9 0 17 2 22 4l3-5c-5-3-15-5-25-5z" fill="#E82127"/><path d="M47 38h6v32h-6z" fill="#E82127"/><path d="M32 35c8 3 15 9 18 15 3-6 10-12 18-15l-2-4c-6 3-12 8-16 13-4-5-10-10-16-13l-2 4z" fill="#E82127"/>'
    }
}

def generate_fallback_svg(name: str, ticker: str, sector: str) -> str:
    """Generate a high-quality stylized SVG badge for companies without custom path data."""
    # Sector color mapping
    sector_colors = {
        "Technology": ("#0A192F", "#64FFDA", "#38BDF8"),
        "Finance": ("#0F172A", "#38BDF8", "#818CF8"),
        "Healthcare": ("#062C24", "#34D399", "#10B981"),
        "Consumer": ("#1F1905", "#FBBF24", "#F59E0B"),
        "Energy": ("#1C100B", "#F97316", "#EA580C"),
        "Industrial": ("#18181B", "#A1A1AA", "#E4E4E7"),
        "Utilities": ("#0B1E28", "#2DD4BF", "#06B6D4"),
        "Telecom": ("#170F28", "#C084FC", "#A855F7"),
    }
    bg, fg, accent = sector_colors.get(sector, ("#0F172A", "#60A5FA", "#3B82F6"))
    
    first_letter = ticker[0]
    sub_text = ticker[:4]

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-grad-{ticker}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{bg}"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>
    <linearGradient id="text-grad-{ticker}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="{fg}"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="url(#bg-grad-{ticker})"/>
  <rect width="98" height="98" x="1" y="1" rx="21" fill="none" stroke="{fg}" stroke-opacity="0.25" stroke-width="1.5"/>
  <circle cx="50" cy="50" r="34" fill="{fg}" fill-opacity="0.08"/>
  <text x="50" y="58" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="36" fill="url(#text-grad-{ticker})" text-anchor="middle" letter-spacing="-1">{first_letter}</text>
  <text x="50" y="82" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="10" fill="{fg}" fill-opacity="0.7" text-anchor="middle" letter-spacing="1">{sub_text}</text>
</svg>'''

def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    logos_dir = os.path.join(root, "public", "logos")
    index_path = os.path.join(root, "data", "companies", "index.json")

    os.makedirs(logos_dir, exist_ok=True)

    with open(index_path, "r", encoding="utf-8") as f:
        companies = json.load(f)

    print(f"Generating SVG logos for {len(companies)} companies in {logos_dir}...")

    for c in companies:
        slug = c["slug"]
        ticker = c["ticker"]
        name = c["name"]
        sector = c["sector"]

        filepath = os.path.join(logos_dir, f"{slug}.svg")

        if slug in LOGOS:
            info = LOGOS[slug]
            bg = info["bg"]
            fg = info["fg"]
            svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <rect width="100" height="100" rx="22" fill="{bg}"/>
  <rect width="98" height="98" x="1" y="1" rx="21" fill="none" stroke="{fg}" stroke-opacity="0.2" stroke-width="1.5"/>
  {info["svg"]}
</svg>'''
        else:
            svg_content = generate_fallback_svg(name, ticker, sector)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(svg_content)

    print(f"[OK] Successfully generated {len(companies)} SVG logos in public/logos/")

if __name__ == "__main__":
    main()
