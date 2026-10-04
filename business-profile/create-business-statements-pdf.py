from pathlib import Path
import json
import sys
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'test-results' / 'pdf-tools'))
import pymupdf
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from pypdf import PdfReader

BASE = ROOT / 'business-profile'
OUT = BASE / 'Hotel-and-Restaurant-Furniture-Business-Statements.pdf'
PREVIEW = ROOT / 'test-results' / 'business-statements-preview'
PREVIEW.mkdir(parents=True, exist_ok=True)
services = json.loads((BASE / 'services.json').read_text(encoding='utf-8'))
by_name = {s['name']: s for s in services}
order = ['Restaurant Furniture Manufacturers', 'Hotel Furniture Manufacturing',
         'Hotel Chairs Manufacturing', 'Restaurant Furniture', 'Cafeteria Furniture',
         'Hotel Furniture', 'Office Furniture', 'School Furniture',
         'College Furniture', 'Hostel Furniture']
entries = [by_name[name] for name in order]
assert len(entries) == 10
intro = ('Business-owned descriptions for your website or Google Posts. '
         'These are not customer reviews or testimonials. '
         'Publishing this content does not guarantee indexing or rankings.')
markdown = '# Hotel and Restaurant Furniture - Business statements\n\n' + intro + '\n\n'
markdown += '\n\n'.join(f"## {i+1}. {s['name']}\n\n{s['description']}" for i, s in enumerate(entries))
markdown += '\n\nVijayawada | +91 8639121227\n'
(BASE / 'business-statements.md').write_text(markdown, encoding='utf-8')

pdfmetrics.registerFont(TTFont('Segoe', 'C:/Windows/Fonts/segoeui.ttf'))
pdfmetrics.registerFont(TTFont('SegoeBold', 'C:/Windows/Fonts/segoeuib.ttf'))
GREEN = colors.HexColor('#214D39')
DARK = colors.HexColor('#172C22')
MUTED = colors.HexColor('#53645B')
LINE = colors.HexColor('#DCE5DE')
PALE = colors.HexColor('#F1F5F1')
W, H = A4
M = 44
CW = W - 2*M
BODY = ParagraphStyle('body', fontName='Segoe', fontSize=10.5, leading=14.5, textColor=DARK)
SMALL = ParagraphStyle('small', fontName='Segoe', fontSize=9, leading=13, textColor=MUTED)

c = canvas.Canvas(str(OUT), pagesize=A4, pageCompression=1)
c.setTitle('Hotel and Restaurant Furniture - 10 Business Statements')
c.setAuthor('Hotel and Restaurant Furniture')
c.setSubject('Business-owned service descriptions, not customer reviews')

def para(text, x, top, width, style):
    p = Paragraph(escape(text), style)
    _, height = p.wrap(width, H)
    p.drawOn(c, x, top-height)
    return height

for page in range(2):
    c.setFillColor(colors.white)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(GREEN)
    c.rect(0, H-143, W, 143, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont('SegoeBold', 16)
    c.drawString(M, H-43, 'Hotel and Restaurant Furniture')
    c.setFont('Segoe', 10)
    c.drawString(M, H-63, 'Vijayawada  |  +91 8639121227')
    c.setFont('SegoeBold', 25)
    c.drawString(M, H-101, 'Business statements')
    c.setFont('Segoe', 10)
    c.drawString(M, H-124, 'BUSINESS COPY  /  NOT CUSTOMER REVIEWS')

    c.setFillColor(PALE)
    c.roundRect(M, 645, CW, 40, 6, fill=1, stroke=0)
    assert para(intro, M+12, 678, CW-24, SMALL) <= 30

    for offset, entry in enumerate(entries[page*5:page*5+5]):
        top = 625-offset*105
        number = page*5+offset+1
        c.setFillColor(GREEN)
        c.roundRect(M, top-26, 27, 27, 5, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.setFont('SegoeBold', 10)
        c.drawCentredString(M+13.5, top-17, f'{number:02d}')
        c.setFillColor(GREEN)
        c.setFont('SegoeBold', 12)
        c.drawString(M+40, top-12, entry['name'])
        height = para(entry['description'], M+40, top-24, CW-40, BODY)
        assert height <= 62, (number, height)
        c.setStrokeColor(LINE)
        c.setLineWidth(0.6)
        c.line(M+40, top-93, W-M, top-93)

    para('Choose the description relevant to the page or post. Use actual product photos. '
         'Keep customer reviews separate and let customers describe their own experience.', M, 91, CW, SMALL)
    c.setStrokeColor(LINE)
    c.line(M, 49, W-M, 49)
    c.setFont('Segoe', 8)
    c.setFillColor(MUTED)
    c.drawString(M, 32, 'Prepared from the business services supplied by the owner')
    c.drawRightString(W-M, 32, f'{page+1} / 2')
    c.showPage()

c.save()
reader = PdfReader(str(OUT))
assert len(reader.pages) == 2
text = ' '.join('\n'.join(page.extract_text() for page in reader.pages).split())
for entry in entries:
    assert ' '.join(entry['description'].split()) in text
    assert entry['name'] in text
assert 'Resturant' not in text
doc = pymupdf.open(OUT)
for i, page in enumerate(doc):
    for b in page.get_text('blocks'):
        assert b[0] >= 0 and b[1] >= 0 and b[2] <= W+1 and b[3] <= H+1
    page.get_pixmap(matrix=pymupdf.Matrix(1.4, 1.4)).save(PREVIEW / f'page-{i+1}.png')
print(f'Created: {OUT}')
print('Verified: 10 factual business statements across 2 pages, with no prices or testimonials.')
