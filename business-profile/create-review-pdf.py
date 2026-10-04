from pathlib import Path
import io
import re
import sys
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'test-results' / 'pdf-tools'))

import qrcode
import pymupdf
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from pypdf import PdfReader

BASE = ROOT / 'business-profile'
OUT = BASE / 'Hotel-and-Restaurant-Furniture-Review-Requests.pdf'
PREVIEW = ROOT / 'test-results' / 'review-pdf-preview'
PREVIEW.mkdir(parents=True, exist_ok=True)
URL = 'https://g.page/r/CdljjbEkN9jsEAI/review'
POLICY = 'https://support.google.com/contributionpolicy/answer/7400114?hl=en'
messages = re.findall(r'^\d+\. (.+)$', (BASE / 'honest-review-requests.md').read_text(encoding='utf-8'), re.M)
assert len(messages) == 10, f'Expected 10 messages, found {len(messages)}'

pdfmetrics.registerFont(TTFont('Segoe', 'C:/Windows/Fonts/segoeui.ttf'))
pdfmetrics.registerFont(TTFont('SegoeBold', 'C:/Windows/Fonts/segoeuib.ttf'))
GREEN = colors.HexColor('#214D39')
DARK = colors.HexColor('#172C22')
MUTED = colors.HexColor('#53645B')
PALE = colors.HexColor('#F1F5F1')
LINE = colors.HexColor('#DCE5DE')
WHITE = colors.white
W, H = A4
M = 44
CW = W - M * 2

body = ParagraphStyle('body', fontName='Segoe', fontSize=11, leading=16, textColor=DARK, alignment=TA_LEFT)
small = ParagraphStyle('small', fontName='Segoe', fontSize=9, leading=13, textColor=MUTED)

qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=8, border=4)
qr.add_data(URL)
qr.make(fit=True)
qr_bytes = io.BytesIO()
qr.make_image(fill_color='#214D39', back_color='white').save(qr_bytes, format='PNG')
qr_bytes.seek(0)
qr_image = ImageReader(qr_bytes)

c = canvas.Canvas(str(OUT), pagesize=A4, pageCompression=1)
c.setTitle('Hotel and Restaurant Furniture - 10 Customer Review Request Messages')
c.setAuthor('Hotel and Restaurant Furniture')
c.setSubject('Optional invitations for genuine customers to share their own Google reviews')

def paragraph(text, x, top, width, style):
    p = Paragraph(text, style)
    _, height = p.wrap(width, H)
    p.drawOn(c, x, top-height)
    return height

for page in range(2):
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(GREEN)
    c.rect(0, H-143, W, 143, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont('SegoeBold', 16)
    c.drawString(M, H-43, 'Hotel and Restaurant Furniture')
    c.setFont('Segoe', 10)
    c.drawString(M, H-63, 'Vijayawada  |  +91 8639121227')
    c.setFont('SegoeBold', 25)
    c.drawString(M, H-102, 'Review request messages')
    c.setFont('Segoe', 10)
    c.drawString(M, H-124, f'Messages {page*5+1:02d}-{page*5+5:02d}  /  Choose one invitation per customer')

    c.setFillColor(PALE)
    c.roundRect(M, 611, CW, 69, 8, fill=1, stroke=0)
    c.setFillColor(DARK)
    c.setFont('SegoeBold', 10)
    c.drawString(M+14, 663, 'Your Google review link')
    c.setFont('Segoe', 10)
    c.setFillColor(GREEN)
    c.drawString(M+14, 646, URL)
    c.linkURL(URL, (M+14, 641, M+365, 657), relative=0, thickness=0)
    c.setFont('Segoe', 9)
    c.setFillColor(MUTED)
    c.drawString(M+14, 628, 'Tap the link or scan. Replace [Name] before sharing.')
    c.drawImage(qr_image, W-M-68, 616, width=59, height=59)
    c.linkURL(URL, (W-M-68, 616, W-M-9, 675), relative=0, thickness=0)

    for offset, message in enumerate(messages[page*5:page*5+5]):
        number = page*5+offset+1
        top = 583-offset*91
        c.setFillColor(GREEN)
        c.roundRect(M, top-29, 29, 29, 6, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont('SegoeBold', 11)
        c.drawCentredString(M+14.5, top-19, f'{number:02d}')
        height = paragraph(escape(message), M+43, top-2, CW-49, body)
        assert height <= 64, (number, height)
        c.setStrokeColor(LINE)
        c.setLineWidth(0.6)
        c.line(M+43, top-76, W-M, top-76)

    paragraph('Send only to customers who have used your business. Feedback is optional; customers choose their own words and rating. Do not request keywords, offer incentives or select only positive feedback.', M, 114, CW, small)
    c.setStrokeColor(LINE)
    c.line(M, 60, W-M, 60)
    c.setFont('Segoe', 8)
    c.setFillColor(MUTED)
    c.drawString(M, 43, 'Business invitation drafts - not customer testimonials')
    c.drawRightString(W-M, 43, f'{page+1} / 2')
    c.setFillColor(GREEN)
    c.drawString(M, 29, 'Google review guidance')
    c.linkURL(POLICY, (M, 26, M+112, 38), relative=0, thickness=0)
    c.showPage()

c.save()
reader = PdfReader(str(OUT))
assert len(reader.pages) == 2
all_text = '\n'.join(p.extract_text() for p in reader.pages)
for text in messages:
    assert ' '.join(text.split()) in ' '.join(all_text.split()), text
assert all_text.count('Hotel and Restaurant Furniture') >= 2
assert 'Resturant' not in all_text
assert all(len(p.get('/Annots', [])) >= 3 for p in reader.pages)
doc = pymupdf.open(OUT)
for i, page in enumerate(doc):
    for b in page.get_text('blocks'):
        assert b[0] >= 0 and b[1] >= 0 and b[2] <= W+1 and b[3] <= H+1, b
    page.get_pixmap(matrix=pymupdf.Matrix(1.4, 1.4)).save(PREVIEW / f'page-{i+1}.png')
print(f'Created: {OUT}')
print(f'Validated: 2 pages, all 10 messages, clickable review links and policy links, no overflowing text.')
print(f'Bytes: {OUT.stat().st_size}')
