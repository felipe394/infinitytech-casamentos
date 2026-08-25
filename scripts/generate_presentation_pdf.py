#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de geração de PDF para Apresentação Comercial e Guia Completo
da Plataforma InfinityTech Casamentos.
Alinhado com a identidade visual do site www.infinitytechservices.com.br.
Inclui a logo oficial da InfinityTech e layout com cards organizados e centralizados.
"""

import sys
import os
import zlib
import struct

class Canvas:
    def __init__(self, width=595.28, height=841.89):
        self.width = width
        self.height = height
        self.pages = []
        self.current_stream = []
        self.xobjects = {} # id -> dict of attributes

    def start_page(self):
        if self.current_stream:
            self.pages.append("\n".join(self.current_stream))
            self.current_stream = []

    def end_page(self):
        if self.current_stream:
            self.pages.append("\n".join(self.current_stream))
            self.current_stream = []

    def encode_str(self, text):
        """Converte string para bytes WinAnsi / CP1252 para suporte a acentos no PDF"""
        cleaned = text.encode('cp1252', errors='replace').decode('latin1')
        escaped = cleaned.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
        return f"({escaped})"

    def set_fill_rgb(self, r, g, b):
        self.current_stream.append(f"{r:.3f} {g:.3f} {b:.3f} rg")

    def set_stroke_rgb(self, r, g, b):
        self.current_stream.append(f"{r:.3f} {g:.3f} {b:.3f} RG")

    def set_line_width(self, w):
        self.current_stream.append(f"{w:.2f} w")

    def rect(self, x, y, w, h, fill=True, stroke=False):
        self.current_stream.append(f"{x:.2f} {y:.2f} {w:.2f} {h:.2f} re")
        if fill and stroke:
            self.current_stream.append("B")
        elif fill:
            self.current_stream.append("f")
        elif stroke:
            self.current_stream.append("s")

    def rounded_rect(self, x, y, w, h, r=6, fill=True, stroke=False):
        k = 0.552284749831
        cx = r * k
        cy = r * k
        s = []
        s.append(f"{x + r:.2f} {y + h:.2f} m")
        s.append(f"{x + w - r:.2f} {y + h:.2f} l")
        s.append(f"{x + w - r + cx:.2f} {y + h:.2f} {x + w:.2f} {y + h - r + cy:.2f} {x + w:.2f} {y + h - r:.2f} c")
        s.append(f"{x + w:.2f} {y + r:.2f} l")
        s.append(f"{x + w:.2f} {y + r - cy:.2f} {x + w - r + cx:.2f} {y:.2f} {x + w - r:.2f} {y:.2f} c")
        s.append(f"{x + r:.2f} {y:.2f} l")
        s.append(f"{x + r - cx:.2f} {y:.2f} {x:.2f} {y + r - cy:.2f} {x:.2f} {y + r:.2f} c")
        s.append(f"{x:.2f} {y + h - r:.2f} l")
        s.append(f"{x:.2f} {y + h - r + cy:.2f} {x + r - cx:.2f} {y + h:.2f} {x + r:.2f} {y + h:.2f} c")

        if fill and stroke:
            s.append("B")
        elif fill:
            s.append("f")
        elif stroke:
            s.append("s")

        self.current_stream.append(" ".join(s))

    def line(self, x1, y1, x2, y2):
        self.current_stream.append(f"{x1:.2f} {y1:.2f} m {x2:.2f} {y2:.2f} l S")

    def draw_text(self, x, y, text, font="F1", size=12, r=0, g=0, b=0, align="left"):
        self.set_fill_rgb(r, g, b)
        encoded = self.encode_str(text)
        
        if align != "left":
            text_width = len(text) * size * 0.52
            if align == "center":
                x = x - (text_width / 2.0)
            elif align == "right":
                x = x - text_width

        s = f"BT /{font} {size:.2f} Tf 1 0 0 1 {x:.2f} {y:.2f} Tm {encoded} Tj ET"
        self.current_stream.append(s)

    def draw_wrapped_text(self, x, y, text, max_width, font="F1", size=10, r=0.2, g=0.2, b=0.2, leading=14, align="left"):
        words = text.split(" ")
        lines = []
        current_line = []
        
        for word in words:
            test_line = " ".join(current_line + [word])
            width = len(test_line) * size * 0.52
            if width > max_width and current_line:
                lines.append(" ".join(current_line))
                current_line = [word]
            else:
                current_line.append(word)
        if current_line:
            lines.append(" ".join(current_line))

        cur_y = y
        for line in lines:
            self.draw_text(x, cur_y, line, font=font, size=size, r=r, g=g, b=b, align=align)
            cur_y -= leading

        return len(lines) * leading

    def draw_image(self, name, x, y, w, h):
        """Desenha imagem XObject no canvas"""
        self.current_stream.append(f"q {w:.2f} 0 0 {h:.2f} {x:.2f} {y:.2f} cm /{name} Do Q")

    def generate_pdf_bytes(self, image_objs=None):
        self.end_page()
        
        objects = []
        def add_object(content):
            objects.append(content)
            return len(objects)

        # Catalog
        add_object("<< /Type /Catalog /Pages 2 0 R >>") # 1
        
        # Pages dict placeholder
        page_count = len(self.pages)
        
        # Fonts
        font_f1_id = 3
        font_f2_id = 4
        font_f3_id = 5
        
        add_object("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>") # 3
        add_object("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>") # 4
        add_object("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>") # 5

        # Adicionar imagens XObject se existirem
        xobject_dict_str = ""
        if image_objs:
            xobj_entries = []
            for img_name, (img_obj_id, smask_obj_id, w, h, rgb_z, alpha_z) in image_objs.items():
                # SMask Obj
                smask_id = add_object(f"""<<
  /Type /XObject
  /Subtype /Image
  /Width {w}
  /Height {h}
  /ColorSpace /DeviceGray
  /BitsPerComponent 8
  /Filter /FlateDecode
  /Length {len(alpha_z)}
>>
stream
""".encode('latin1') + alpha_z + b"\nendstream")

                # Main RGB Obj
                img_id = add_object(f"""<<
  /Type /XObject
  /Subtype /Image
  /Width {w}
  /Height {h}
  /ColorSpace /DeviceRGB
  /BitsPerComponent 8
  /Filter /FlateDecode
  /SMask {smask_id} 0 R
  /Length {len(rgb_z)}
>>
stream
""".encode('latin1') + rgb_z + b"\nendstream")
                xobj_entries.append(f"/{img_name} {img_id} 0 R")
            xobject_dict_str = f"/XObject << {' '.join(xobj_entries)} >>"

        # Refazemos o objeto Pages com os IDs corretos
        first_page_obj_id = len(objects) + 1
        page_refs = [f"{first_page_obj_id + i * 2} 0 R" for i in range(page_count)]
        pages_dict = f"<< /Type /Pages /Kids [ {' '.join(page_refs)} ] /Count {page_count} >>"
        
        # Inserimos a atualização do objeto 2 (Pages)
        objects[1] = pages_dict

        # Criar objetos de Página e Conteúdo (Streams)
        for i, page_content in enumerate(self.pages):
            content_id = first_page_obj_id + i * 2 + 1
            page_obj = f"""<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [ 0 0 {self.width:.2f} {self.height:.2f} ]
  /Resources <<
    /Font <<
      /F1 3 0 R
      /F2 4 0 R
      /F3 5 0 R
    >>
    {xobject_dict_str}
  >>
  /Contents {content_id} 0 R
>>"""
            add_object(page_obj)

            stream_bytes = page_content.encode('latin1')
            stream_obj = f"""<<
  /Length {len(stream_bytes)}
>>
stream
{page_content}
endstream"""
            add_object(stream_obj)

        pdf_buf = bytearray()
        pdf_buf.extend(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
        
        offsets = {}
        for idx, obj in enumerate(objects, 1):
            offsets[idx] = len(pdf_buf)
            if isinstance(obj, bytes):
                pdf_buf.extend(f"{idx} 0 obj\n".encode('latin1') + obj + f"\nendobj\n".encode('latin1'))
            else:
                pdf_buf.extend(f"{idx} 0 obj\n{obj}\nendobj\n".encode('latin1'))

        xref_offset = len(pdf_buf)
        pdf_buf.extend(f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode('latin1'))
        for idx in range(1, len(objects) + 1):
            pdf_buf.extend(f"{offsets[idx]:010d} 00000 n \n".encode('latin1'))

        trailer = f"""trailer
<<
  /Size {len(objects) + 1}
  /Root 1 0 R
>>
startxref
{xref_offset}
%%EOF
"""
        pdf_buf.extend(trailer.encode('latin1'))
        return bytes(pdf_buf)

def load_png_logo(path):
    if not os.path.exists(path):
        return None
    with open(path, 'rb') as f:
        data = f.read()
    if not data.startswith(b'\x89PNG\r\n\x1a\n'):
        return None
    
    idx = 8
    w, h, depth, color_type = 0, 0, 0, 0
    idat_chunks = []
    
    while idx < len(data):
        length, chunk_type = struct.unpack('>I4s', data[idx:idx+8])
        idx += 8
        chunk_data = data[idx:idx+length]
        idx += length + 4 # skip CRC
        
        if chunk_type == b'IHDR':
            w, h, depth, color_type = struct.unpack('>IIBB', chunk_data[:10])
        elif chunk_type == b'IDAT':
            idat_chunks.append(chunk_data)
        elif chunk_type == b'IEND':
            break
            
    decompressed = zlib.decompress(b''.join(idat_chunks))
    
    bpp = 4 # RGBA 8-bit
    line_len = 1 + w * bpp
    rgb_data = bytearray()
    alpha_data = bytearray()
    
    prev_line = bytearray(w * bpp)
    
    for row in range(h):
        line_start = row * line_len
        filter_type = decompressed[line_start]
        raw_line = bytearray(decompressed[line_start+1 : line_start+line_len])
        curr_line = bytearray(w * bpp)
        
        for col in range(w * bpp):
            x = raw_line[col]
            a = curr_line[col - bpp] if col >= bpp else 0
            b = prev_line[col]
            c = prev_line[col - bpp] if col >= bpp else 0
            
            if filter_type == 0:
                val = x
            elif filter_type == 1:
                val = (x + a) & 0xFF
            elif filter_type == 2:
                val = (x + b) & 0xFF
            elif filter_type == 3:
                val = (x + (a + b) // 2) & 0xFF
            elif filter_type == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                if pa <= pb and pa <= pc:
                    pr = a
                elif pb <= pc:
                    pr = b
                else:
                    pr = c
                val = (x + pr) & 0xFF
            else:
                val = x
                
            curr_line[col] = val
            
        prev_line = curr_line
        
        for px in range(w):
            offset = px * 4
            rgb_data.extend(curr_line[offset:offset+3])
            alpha_data.append(curr_line[offset+3])
            
    return w, h, zlib.compress(bytes(rgb_data)), zlib.compress(bytes(alpha_data))

def build_presentation():
    c = Canvas()
    
    # =========================================================================
    # CORES DA INFINITYTECH SERVICES (www.infinitytechservices.com.br)
    # =========================================================================
    NAVY = (0.04, 0.07, 0.16)         # #0A1128 (Dark Tech Navy - Header & Base)
    DEEP_BLUE = (0.06, 0.09, 0.18)    # #0F172A (Deep Slate Navy - Text/Cards)
    ELECTRIC_BLUE = (0.00, 0.53, 1.00)# #0088FF (Electric Cyan/Blue Accent)
    CYAN_LIGHT = (0.88, 0.95, 1.00)   # #E0F2FE (Fundo Suave de Destaque)
    WHITE = (1.0, 1.0, 1.0)
    CARD_BG = (0.97, 0.98, 0.99)      # #F8FAFC (Card Background Clean)
    BORDER_COLOR = (0.80, 0.84, 0.88) # #CBD5E1 (Borda Suave)
    DARK_TEXT = (0.06, 0.09, 0.16)    # #0F172A
    GRAY_TEXT = (0.28, 0.33, 0.41)    # #475569

    # Carregar Logo Oficial se disponível
    logo_path = os.path.join(os.getcwd(), "public", "logo.png")
    parsed_logo = load_png_logo(logo_path)
    image_objs = {}
    has_logo = False
    if parsed_logo:
        w_img, h_img, rgb_z, alpha_z = parsed_logo
        image_objs["LogoImg"] = (None, None, w_img, h_img, rgb_z, alpha_z)
        has_logo = True

    def draw_header_footer(page_num, total_pages, title="INFINITYTECH SERVICES • CASAMENTOS"):
        if page_num == 1:
            return
        
        # Top Header Bar
        c.set_fill_rgb(*NAVY)
        c.rect(0, 796, 595.28, 45.89)
        
        c.set_fill_rgb(*ELECTRIC_BLUE)
        c.rect(0, 792, 595.28, 4)
        
        # Logo no Header (se existir)
        if has_logo:
            c.draw_image("LogoImg", 40, 802, 28, 28)
            c.draw_text(76, 812, "INFINITYTECH SERVICES", font="F2", size=10, r=WHITE[0], g=WHITE[1], b=WHITE[2])
        else:
            c.draw_text(40, 812, "INFINITYTECH SERVICES", font="F2", size=10, r=WHITE[0], g=WHITE[1], b=WHITE[2])
            
        c.draw_text(555, 812, f"Guia da Plataforma • Pág {page_num}/{total_pages}", font="F1", size=9, r=CYAN_LIGHT[0], g=CYAN_LIGHT[1], b=CYAN_LIGHT[2], align="right")
        
        # Footer
        c.set_stroke_rgb(*BORDER_COLOR)
        c.set_line_width(0.8)
        c.line(40, 45, 555, 45)
        
        c.draw_text(40, 32, "www.infinitytechservices.com.br • casamento.infinitytechservices.com.br", font="F1", size=8, r=GRAY_TEXT[0], g=GRAY_TEXT[1], b=GRAY_TEXT[2])
        c.draw_text(555, 32, "InfinityTech Services © 2026", font="F2", size=8, r=ELECTRIC_BLUE[0], g=ELECTRIC_BLUE[1], b=ELECTRIC_BLUE[2], align="right")

    # =========================================================================
    # PÁGINA 1: CAPA IMPRESSIONANTE (CENTRALIZADA COM LOGO E CORES OFICIAIS)
    # =========================================================================
    c.start_page()
    
    # Fundo do Banner Topo
    c.set_fill_rgb(*NAVY)
    c.rect(0, 520, 595.28, 321.89)
    
    # Linha Azul Elétrico de Destaque
    c.set_fill_rgb(*ELECTRIC_BLUE)
    c.rect(0, 514, 595.28, 6)
    
    # Logo Centralizada na Capa
    if has_logo:
        c.draw_image("LogoImg", 257.64, 730, 80, 80)
        c.draw_text(297.64, 705, "INFINITYTECH SERVICES", font="F2", size=12, r=ELECTRIC_BLUE[0], g=ELECTRIC_BLUE[1], b=ELECTRIC_BLUE[2], align="center")
    else:
        c.draw_text(297.64, 745, "INFINITYTECH SERVICES", font="F2", size=14, r=ELECTRIC_BLUE[0], g=ELECTRIC_BLUE[1], b=ELECTRIC_BLUE[2], align="center")

    # Título Principal Ajustado (Duas linhas bem centralizadas para evitar estouro)
    c.draw_text(297.64, 668, "PLATAFORMA INTERATIVA", font="F2", size=20, r=WHITE[0], g=WHITE[1], b=WHITE[2], align="center")
    c.draw_text(297.64, 642, "DE CASAMENTOS", font="F2", size=22, r=WHITE[0], g=WHITE[1], b=WHITE[2], align="center")
    c.draw_text(297.64, 616, "A Experiência Digital Perfeita para o Seu Grande Dia", font="F3", size=12, r=CYAN_LIGHT[0], g=CYAN_LIGHT[1], b=CYAN_LIGHT[2], align="center")
    
    # Badge Centralizado
    c.set_fill_rgb(*ELECTRIC_BLUE)
    c.rounded_rect(167.64, 555, 260, 32, r=16)
    c.draw_text(297.64, 566, "GUIA COMPLETO & APRESENTAÇÃO COMERCIAL", font="F2", size=9, r=WHITE[0], g=WHITE[1], b=WHITE[2], align="center")
    
    # Caixa Proposta de Valor Centralizada
    c.set_fill_rgb(*CYAN_LIGHT)
    c.set_stroke_rgb(*ELECTRIC_BLUE)
    c.rounded_rect(40, 395, 515, 95, r=10, fill=True, stroke=True)
    
    c.draw_text(297.64, 465, "POR QUE ESCOLHER A PLATAFORMA INFINITYTECH?", font="F2", size=11, r=NAVY[0], g=NAVY[1], b=NAVY[2], align="center")
    prop_text = "Criada para casais que buscam elegância, praticidade e autonomia. Nossa plataforma centraliza todas as informações do seu evento, gerencia confirmações de presença (RSVP), arrecada presentes via PIX direto na sua conta bancária e conecta seu convite impresso ao digital com QR Codes exclusivos."
    c.draw_wrapped_text(60, 445, prop_text, max_width=475, font="F1", size=9.5, r=DARK_TEXT[0], g=DARK_TEXT[1], b=DARK_TEXT[2], leading=13.5, align="center")

    # 4 Pilares Principais (Grid 2x2 perfeitamente alinhado e centralizado)
    pilares = [
        ("100% PIX Direto aos Noivos", "Receba o valor dos presentes em dinheiro diretamente no seu banco. Sem taxas abusivas e sem intermediação engessada."),
        ("RSVP em Tempo Real", "Controle instantâneo de presenças confirmadas, acompanhantes e restrições para enviar ao cerimonialista e buffet."),
        ("Studio de QR Code Integrado", "Gere QR Codes elegantes em alta resolução para aplicar diretamente no seu convite impresso ou enviar via WhatsApp."),
        ("Design Elegante & Responsivo", "Visual deslumbrante, contagem regressiva, linha do tempo dos noivos, mapa interativo e galeria de fotos pré-wedding.")
    ]
    
    positions = [(40, 245), (298, 245), (40, 95), (298, 95)]
    for idx, (p_title, p_desc) in enumerate(pilares):
        px, py = positions[idx]
        c.set_fill_rgb(*CARD_BG)
        c.set_stroke_rgb(*BORDER_COLOR)
        c.rounded_rect(px, py, 247, 132, r=8, fill=True, stroke=True)
        
        # Header do Card
        c.set_fill_rgb(*NAVY)
        c.rounded_rect(px, py + 104, 247, 28, r=4)
        c.draw_text(px + 123.5, py + 113, p_title, font="F2", size=9.5, r=WHITE[0], g=WHITE[1], b=WHITE[2], align="center")
        
        c.draw_wrapped_text(px + 15, py + 85, p_desc, max_width=217, font="F1", size=9, r=DARK_TEXT[0], g=DARK_TEXT[1], b=DARK_TEXT[2], leading=13, align="left")

    # Rodapé da Capa
    c.set_stroke_rgb(*ELECTRIC_BLUE)
    c.set_line_width(1)
    c.line(40, 55, 555, 55)
    c.draw_text(297.64, 38, "InfinityTech Services • Soluções Digitais de Alta Performance", font="F2", size=9, r=NAVY[0], g=NAVY[1], b=NAVY[2], align="center")
    c.draw_text(297.64, 24, "www.infinitytechservices.com.br", font="F1", size=8, r=GRAY_TEXT[0], g=GRAY_TEXT[1], b=GRAY_TEXT[2], align="center")

    # =========================================================================
    # PÁGINA 2: POR QUE TER UMA PLATAFORMA DE CASAMENTO? (VALOR ESTRATÉGICO)
    # =========================================================================
    c.start_page()
    draw_header_footer(2, 6)
    
    c.draw_text(297.64, 762, "1. O VALOR ESTRATÉGICO PARA OS NOIVOS", font="F2", size=15, r=NAVY[0], g=NAVY[1], b=NAVY[2], align="center")
    c.draw_text(297.64, 746, "Por que um site de casamento é indispensável no planejamento moderno?", font="F3", size=10.5, r=GRAY_TEXT[0], g=GRAY_TEXT[1], b=GRAY_TEXT[2], align="center")

    desafios_solucoes = [
        ("Desafio 1: Mensagens Repetitivas no WhatsApp",
         "Sem um ponto central, os noivos recebem dezenas de mensagens perguntando sobre horário, endereço, traje, lista de presentes e como chegar.",
         "Solução: Um link único com todas as informações organizadas, mapas interativos e respostas para todas as dúvidas frequentes em um clique."),
        
        ("Desafio 2: Presentes Físicos Repetidos ou Inúteis",
         "Listas de casamentos tradicionais engessam os noivos com produtos físicos que muitas vezes já possuem ou precisam trocar com burocracia.",
         "Solução: Cotas virtuais divertidas com pagamento via PIX/Mercado Pago. O dinheiro vai direto para a conta do casal investir na lua de mel ou casa nova."),
        
        ("Desafio 3: Descontrole na Lista de Convidados (RSVP)",
         "Falta de confirmação exata dificulta o dimensionamento de mesas, buffet, bebidas e lembrancinhas, gerando desperdício financeiro.",
         "Solução: Formulário de RSVP online onde o convidado confirma presenças e acompanhantes. Relatório consolidado e exportável em Excel para a cerimonialista."),
        
        ("Desafio 4: Conexão Entre Convite Físico e Digital",
         "Muitos convidados perdem o link do site enviado por mensagem ou não digitam URLs longas.",
         "Solução: QR Code Studio integrado que permite gerar um código QR visualmente personalizado para ser impresso diretamente no convite de papel.")
    ]

    y_pos = 712
    for title, desaf, sol in desafios_solucoes:
        c.set_fill_rgb(*CARD_BG)
        c.set_stroke_rgb(*BORDER_COLOR)
        c.rounded_rect(40, y_pos - 120, 515, 115, r=8, fill=True, stroke=True)
        
        # Borda lateral esquerda azul elétrico
        c.set_fill_rgb(*ELECTRIC_BLUE)
        c.rounded_rect(40, y_pos - 120, 6, 115, r=3)
        
        c.draw_text(58, y_pos - 20, title, font="F2", size=11, r=NAVY[0], g=NAVY[1], b=NAVY[2])
        
        c.draw_text(58, y_pos - 38, "Problema tradicional:", font="F2", size=9, r=ELECTRIC_BLUE[0], g=ELECTRIC_BLUE[1], b=ELECTRIC_BLUE[2])
        c.draw_wrapped_text(160, y_pos - 38, desaf, max_width=382, font="F1", size=9, r=DARK_TEXT[0], g=DARK_TEXT[1], b=DARK_TEXT[2], leading=12)
        
        c.draw_text(58, y_pos - 75, "Vantagem InfinityTech:", font="F2", size=9, r=NAVY[0], g=NAVY[1], b=NAVY[2])
        c.draw_wrapped_text(160, y_pos - 75, sol, max_width=382, font="F1", size=9, r=DARK_TEXT[0], g=DARK_TEXT[1], b=DARK_TEXT[2], leading=12)
        
        y_pos -= 130

    c.set_fill_rgb(*CYAN_LIGHT)
    c.set_stroke_rgb(*ELECTRIC_BLUE)
    c.rounded_rect(40, 65, 515, 95, r=8, fill=True, stroke=True)
    c.draw_text(297.64, 137, "ECONOMIA DE TEMPO, ELEGÂNCIA E TRANQUILIDADE", font="F2", size=11, r=NAVY[0], g=NAVY[1], b=NAVY[2], align="center")
    impact_text = "Com a plataforma InfinityTech Casamentos, os noivos reduzem em até 80% o tempo gasto com atendimento a dúvidas de convidados e garantem que 100% da arrecadação de presentes seja disponibilizada de forma simples, transparente e sem complicações."
    c.draw_wrapped_text(60, 118, impact_text, max_width=475, font="F1", size=9, r=DARK_TEXT[0], g=DARK_TEXT[1], b=DARK_TEXT[2], leading=13.5, align="center")

    # =========================================================================
    # PÁGINA 3: TOUR COMPLETO PELAS FUNCIONALIDADES (MÓDULOS DO CLIENTE)
    # =========================================================================
    c.start_page()
    draw_header_footer(3, 6)
    
    c.draw_text(297.64, 762, "2. TOUR COMPLETO PELOS MÓDULOS DA PLATAFORMA", font="F2", size=15, r=NAVY[0], g=NAVY[1], b=NAVY[2], align="center")
    c.draw_text(297.64, 746, "Conheça em detalhes a experiência do convidado ao navegar pelo seu site", font="F3", size=10.5, r=GRAY_TEXT[0], g=GRAY_TEXT[1], b=GRAY_TEXT[2], align="center")

    modulos = [
        ("Home & Contagem Regressiva", 
         "Capa de alto impacto com foto do casal, nome dos noivos, data especial e cronômetro em tempo real (Dias, Horas, Minutos e Segundos) que gera expectativa nos convidados."),
        
        ("Nossa História (Linha do Tempo)", 
         "Espaço emocionante para contar como os noivos se conheceram, os momentos marcantes do namoro, o pedido de casamento e fotos inesquecíveis."),
        
        ("O Evento & Guia dos Convidados", 
         "Informações completas sobre Cerimônia e Recepção: endereço exato, horário, mapa interativo com integração Waze e Google Maps, código de vestimenta (dress code) e recomendações de hospedagem/salão."),
        
        ("Lista de Presentes com PIX e Cartão", 
         "Catálogo completo de presentes virtuais (cotas de lua de mel, eletrodomésticos simbólicos, brincadeiras dos padrinhos). Pagamento instantâneo via QR Code PIX ou Cartão via Mercado Pago."),
        
        ("Confirmar Presença (RSVP)", 
         "Formulário moderno e intuitivo para o convidado pesquisar seu nome, confirmar presença, informar o número exato de acompanhantes e deixar restrições alimentares ou observações."),
        
        ("Galeria de Fotos Pré-Wedding", 
         "Mosaico interativo de alta definição para exibir o ensaio pré-casamento do casal com transições suaves e carregamento otimizado para celulares.")
    ]

    y_mod = 712
    for idx, (m_title, m_desc) in enumerate(modulos, 1):
        c.set_fill_rgb(*CARD_BG)
        c.set_stroke_rgb(*BORDER_COLOR)
        c.rounded_rect(40, y_mod - 82, 515, 78, r=6, fill=True, stroke=True)
        
        # Badge Numérico em Azul Elétrico
        c.set_fill_rgb(*ELECTRIC_BLUE)
        c.rounded_rect(52, y_mod - 28, 26, 20, r=4)
        c.draw_text(65, y_mod - 23, str(idx), font="F2", size=11, r=WHITE[0], g=WHITE[1], b=WHITE[2], align="center")
        
        c.draw_text(88, y_mod - 23, m_title, font="F2", size=11, r=NAVY[0], g=NAVY[1], b=NAVY[2])
        c.draw_wrapped_text(88, y_mod - 42, m_desc, max_width=450, font="F1", size=9, r=DARK_TEXT[0], g=DARK_TEXT[1], b=DARK_TEXT[2], leading=13)
        
        y_mod -= 93

    c.set_fill_rgb(*CYAN_LIGHT)
    c.set_stroke_rgb(*ELECTRIC_BLUE)
    c.rounded_rect(40, 65, 515, 75, r=8, fill=True, stroke=True)
    c.draw_text(297.64, 118, "EXPERIÊNCIA MULTITELA: 100% RESPONSIVA", font="F2", size=11, r=NAVY[0], g=NAVY[1], b=NAVY[2], align="center")
    c.draw_wrapped_text(60, 100, "A plataforma é otimizada para smartphones (iOS e Android), tablets e computadores. O layout se adapta perfeitamente a qualquer tamanho de tela, garantindo extrema facilidade para os convidados de todas as idades.", max_width=475, font="F1", size=9, r=DARK_TEXT[0], g=DARK_TEXT[1], b=DARK_TEXT[2], leading=13, align="center")

    # =========================================================================
    # PÁGINA 4: PAINEL DE CONTROLE DOS NOIVOS & GERADOR DE QR CODE
    # =========================================================================
    c.start_page()
    draw_header_footer(4, 6)
    
    c.draw_text(297.64, 762, "3. PAINEL ADMIN & QR CODE STUDIO", font="F2", size=15, r=NAVY[0], g=NAVY[1], b=NAVY[2], align="center")
    c.draw_text(297.64, 746, "Autonomia total para gerenciar seu casamento com recursos exclusivos", font="F3", size=10.5, r=GRAY_TEXT[0], g=GRAY_TEXT[1], b=GRAY_TEXT[2], align="center")

    # Bloco Admin
    c.set_fill_rgb(*CARD_BG)
    c.set_stroke_rgb(*BORDER_COLOR)
    c.rounded_rect(40, 480, 515, 250, r=8, fill=True, stroke=True)
    
    c.set_fill_rgb(*NAVY)
    c.rounded_rect(40, 700, 515, 30, r=4)
    c.draw_text(297.64, 710, "PAINEL DE CONTROLE DOS NOIVOS (ADMIN)", font="F2", size=11.5, r=WHITE[0], g=WHITE[1], b=WHITE[2], align="center")

    admin_features = [
        ("Dashboard com Indicadores de RSVP", "Visualização clara do número de convidados confirmados, recusados, pendentes e contagem total de acompanhantes adultas e crianças."),
        ("Exportação Completa para Excel (.xlsx)", "Com um único clique, baixe a lista de presenças em formato de planilha Excel, pronta para enviar à equipe do buffet, recepção e cerimonial."),
        ("Gestão da Lista de Presentes & Extrato", "Acompanhe todas as cotas compradas pelos convidados, com identificação do doador, mensagem especial recebida e valor creditado."),
        ("Segurança & Acesso Restrito", "Área protegida por autenticação com e-mail e senha. Apenas os noivos têm acesso às informações confidenciais do evento.")
    ]

    y_adm = 675
    for title, desc in admin_features:
        c.set_fill_rgb(*ELECTRIC_BLUE)
        c.rect(55, y_adm - 3, 6, 6)
        c.draw_text(68, y_adm, title, font="F2", size=10, r=NAVY[0], g=NAVY[1], b=NAVY[2])
        c.draw_wrapped_text(68, y_adm - 16, desc, max_width=465, font="F1", size=9, r=DARK_TEXT[0], g=DARK_TEXT[1], b=DARK_TEXT[2], leading=12)
        y_adm -= 44

    # Bloco QR Code
    c.set_fill_rgb(*CARD_BG)
    c.set_stroke_rgb(*BORDER_COLOR)
    c.rounded_rect(40, 180, 515, 280, r=8, fill=True, stroke=True)
    
    c.set_fill_rgb(*ELECTRIC_BLUE)
    c.rounded_rect(40, 430, 515, 30, r=4)
    c.draw_text(297.64, 440, "ESTÚDIO DE QR CODE INTEGRADO (EXCLUSIVIDADE INFINITYTECH)", font="F2", size=11.5, r=WHITE[0], g=WHITE[1], b=WHITE[2], align="center")

    qr_features = [
        ("Destinos Personalizáveis", "Gere QR Codes que direcionam para o site principal, direto para a confirmação de presença (RSVP), para a lista de presentes ou para as fotos do evento."),
        ("Personalização de Temas Visuais", "Escolha entre estilos visuais elegantes: Romântico, Clean, Gold Premium ou Dark Elegance para combinar com a paleta de cores do seu convite físico."),
        ("Textos de Apoio Customizáveis", "Adicione títulos e frases explicativas personalizadas para orientar os convidados como escanear o código com a câmera do celular."),
        ("Exportação em Alta Resolução", "Faça o download do cartão ou do código isolado em imagem HD pronta para enviar à gráfica responsável pela impressão do seu convite de papel.")
    ]

    y_qr = 405
    for title, desc in qr_features:
        c.set_fill_rgb(*NAVY)
        c.rect(55, y_qr - 3, 6, 6)
        c.draw_text(68, y_qr, title, font="F2", size=10, r=NAVY[0], g=NAVY[1], b=NAVY[2])
        c.draw_wrapped_text(68, y_qr - 16, desc, max_width=465, font="F1", size=9, r=DARK_TEXT[0], g=DARK_TEXT[1], b=DARK_TEXT[2], leading=12)
        y_qr -= 44

    c.set_fill_rgb(*CYAN_LIGHT)
    c.set_stroke_rgb(*ELECTRIC_BLUE)
    c.rounded_rect(40, 65, 515, 95, r=8, fill=True, stroke=True)
    c.draw_text(297.64, 137, "INTEGRAÇÃO PERFEITA ENTRE O CONVITE FÍSICO E DIGITAL", font="F2", size=11, r=NAVY[0], g=NAVY[1], b=NAVY[2], align="center")
    qr_footer_text = "Com o nosso Gerador de QR Code, seu convite impresso se transforma em uma porta de entrada interativa. O convidado aponta a câmera do celular para o convite físico e é redirecionado instantaneamente para a confirmação de presença ou lista de presentes."
    c.draw_wrapped_text(60, 118, qr_footer_text, max_width=475, font="F1", size=9, r=DARK_TEXT[0], g=DARK_TEXT[1], b=DARK_TEXT[2], leading=13, align="center")

    # =========================================================================
    # PÁGINA 5: PASSO A PASSO & QUADRO COMPARATIVO
    # =========================================================================
    c.start_page()
    draw_header_footer(5, 6)
    
    c.draw_text(297.64, 762, "4. PASSO A PASSO & QUADRO COMPARATIVO", font="F2", size=15, r=NAVY[0], g=NAVY[1], b=NAVY[2], align="center")
    c.draw_text(297.64, 746, "Como funciona na prática e as vantagens em relação às outras opções", font="F3", size=10.5, r=GRAY_TEXT[0], g=GRAY_TEXT[1], b=GRAY_TEXT[2], align="center")

    c.draw_text(297.64, 722, "GUIA DE UTILIZAÇÃO PARA OS NOIVOS EM 4 PASSOS:", font="F2", size=11, r=NAVY[0], g=NAVY[1], b=NAVY[2], align="center")

    passos = [
        ("Passo 1", "Personalização", "Fotos do pré-wedding, data, local da cerimônia e história do casal."),
        ("Passo 2", "Chave PIX", "Escolha das cotas virtuais e cadastro da sua chave PIX direta."),
        ("Passo 3", "Divulgação", "QR Code no convite impresso ou envio do link por WhatsApp."),
        ("Passo 4", "Gestão RSVP", "Acompanhamento em tempo real e exportação Excel para o buffet.")
    ]

    for idx, (p_num, p_title, p_desc) in enumerate(passos):
        px = 40 + idx * 130
        c.set_fill_rgb(*CARD_BG)
        c.set_stroke_rgb(*BORDER_COLOR)
        c.rounded_rect(px, 595, 122, 115, r=6, fill=True, stroke=True)
        
        c.set_fill_rgb(*NAVY)
        c.rounded_rect(px + 10, 680, 102, 20, r=4)
        c.draw_text(px + 61, 686, p_num, font="F2", size=9, r=WHITE[0], g=WHITE[1], b=WHITE[2], align="center")
        
        c.draw_text(px + 61, 663, p_title, font="F2", size=8.5, r=NAVY[0], g=NAVY[1], b=NAVY[2], align="center")
        c.draw_wrapped_text(px + 8, 648, p_desc, max_width=106, font="F1", size=7.5, r=DARK_TEXT[0], g=DARK_TEXT[1], b=DARK_TEXT[2], leading=10, align="center")

    c.draw_text(297.64, 560, "QUADRO COMPARATIVO: INFINITYTECH vs SOLUÇÕES TRADICIONAIS", font="F2", size=11, r=NAVY[0], g=NAVY[1], b=NAVY[2], align="center")

    c.set_fill_rgb(*NAVY)
    c.rounded_rect(40, 520, 515, 25, r=4)
    c.draw_text(50, 528, "Recurso / Funcionalidade", font="F2", size=9, r=WHITE[0], g=WHITE[1], b=WHITE[2])
    c.draw_text(260, 528, "Plataforma InfinityTech", font="F2", size=9, r=WHITE[0], g=WHITE[1], b=WHITE[2])
    c.draw_text(420, 528, "Outras Plataformas", font="F2", size=9, r=WHITE[0], g=WHITE[1], b=WHITE[2])

    rows = [
        ("Recebimento dos Presentes", "100% PIX Direto na sua conta", "Taxas de 3.99% a 6% por presente"),
        ("Prazo de Liberação do Dinheiro", "Instantâneo (Na hora via PIX)", "De 14 a 30 dias após a compra"),
        ("Gerador de QR Code Integrado", "SIM (Estúdio completo com estilos)", "NÃO (Apenas gera link comum)"),
        ("Exportação Excel de Convidados", "SIM (Inclusa e ilimitada)", "Muitas vezes cobrada como extra"),
        ("Design Responsivo Premium", "SIM (Moderno e sem anúncios)", "Com propagandas nas versões grátis"),
        ("Autonomia e Suporte Técnico", "SIM (Suporte direto InfinityTech)", "Atendimento robotizado / genérico"),
        ("Personalização de Presentes", "Totalmente flexível (Cotas e PIX)", "Engessado em catálogo pré-definido")
    ]

    y_row = 495
    for idx, (col1, col2, col3) in enumerate(rows):
        bg = CYAN_LIGHT if idx % 2 == 0 else CARD_BG
        c.set_fill_rgb(*bg)
        c.rect(40, y_row - 4, 515, 24)
        c.set_stroke_rgb(*BORDER_COLOR)
        c.line(40, y_row - 4, 555, y_row - 4)

        c.draw_text(50, y_row + 3, col1, font="F2", size=8.5, r=NAVY[0], g=NAVY[1], b=NAVY[2])
        c.draw_text(260, y_row + 3, col2, font="F1", size=8.5, r=DARK_TEXT[0], g=DARK_TEXT[1], b=DARK_TEXT[2])
        c.draw_text(420, y_row + 3, col3, font="F1", size=8.5, r=GRAY_TEXT[0], g=GRAY_TEXT[1], b=GRAY_TEXT[2])
        
        y_row -= 25

    c.set_fill_rgb(*CYAN_LIGHT)
    c.set_stroke_rgb(*ELECTRIC_BLUE)
    c.rounded_rect(40, 65, 515, 95, r=8, fill=True, stroke=True)
    c.draw_text(297.64, 137, "MÁXIMO RETORNO FINANCEIRO E SEM SURPRESAS", font="F2", size=11, r=NAVY[0], g=NAVY[1], b=NAVY[2], align="center")
    comp_footer = "Ao optar pela plataforma InfinityTech Casamentos, os noivos economizam centenas ou milhares de reais em taxas de intermediação de presentes, além de contarem com uma tecnologia moderna, confiável e com a cara do casal."
    c.draw_wrapped_text(60, 118, comp_footer, max_width=475, font="F1", size=9, r=DARK_TEXT[0], g=DARK_TEXT[1], b=DARK_TEXT[2], leading=13, align="center")

    # =========================================================================
    # PÁGINA 6: ENCERRAMENTO & CHAMADA PARA AÇÃO (CTA)
    # =========================================================================
    c.start_page()
    draw_header_footer(6, 6)
    
    # Hero Card
    c.set_fill_rgb(*NAVY)
    c.rounded_rect(40, 560, 515, 205, r=10, fill=True, stroke=False)
    
    if has_logo:
        c.draw_image("LogoImg", 267.64, 715, 60, 60)
        c.draw_text(297.64, 695, "FAÇA DO SEU CASAMENTO UM EVENTO INESQUECÍVEL", font="F2", size=14, r=WHITE[0], g=WHITE[1], b=WHITE[2], align="center")
    else:
        c.draw_text(297.64, 715, "FAÇA DO SEU CASAMENTO UM EVENTO INESQUECÍVEL", font="F2", size=14, r=WHITE[0], g=WHITE[1], b=WHITE[2], align="center")

    c.draw_text(297.64, 676, "Tecnologia, elegância e controle total na palma da sua mão", font="F3", size=11, r=CYAN_LIGHT[0], g=CYAN_LIGHT[1], b=CYAN_LIGHT[2], align="center")

    c.set_fill_rgb(*ELECTRIC_BLUE)
    c.rounded_rect(147.64, 625, 300, 36, r=18)
    c.draw_text(297.64, 638, "SOLICITE UMA DEMONSTRAÇÃO AO VIVO", font="F2", size=10.5, r=WHITE[0], g=WHITE[1], b=WHITE[2], align="center")

    cta_desc = "Experimente a plataforma na prática e descubra como podemos personalizar cada detalhe do site para refletir perfeitamente a história e o estilo do casal."
    c.draw_wrapped_text(65, 595, cta_desc, max_width=465, font="F1", size=9.5, r=WHITE[0], g=WHITE[1], b=WHITE[2], leading=13.5, align="center")

    # Card 1: Como Adquirir
    c.set_fill_rgb(*CARD_BG)
    c.set_stroke_rgb(*BORDER_COLOR)
    c.rounded_rect(40, 340, 515, 195, r=8, fill=True, stroke=True)
    
    c.draw_text(297.64, 505, "COMO ADQUIRIR A PLATAFORMA PARA O SEU EVENTO:", font="F2", size=11.5, r=NAVY[0], g=NAVY[1], b=NAVY[2], align="center")

    etapas_contrato = [
        ("1. Atendimento & Alinhamento", "Entre em contato com nossa equipe para tirar dúvidas e definir os detalhes do seu evento."),
        ("2. Personalização do Projeto", "Envie suas fotos, dados da cerimônia e chaves PIX. Nós cuidamos da configuração inicial do seu site."),
        ("3. Entrega & Treinamento", "Receba seu domínio ativo, logins do Painel Admin e os QR Codes em alta resolução prontos para uso."),
        ("4. Suporte Até o Dia do Evento", "Conte com nossa equipe para garantir que tudo funcione perfeitamente antes, durante e após o casamento.")
    ]

    y_etapa = 480
    for title, desc in etapas_contrato:
        c.draw_text(60, y_etapa, title, font="F2", size=10, r=NAVY[0], g=NAVY[1], b=NAVY[2])
        c.draw_wrapped_text(220, y_etapa, desc, max_width=320, font="F1", size=9, r=DARK_TEXT[0], g=DARK_TEXT[1], b=DARK_TEXT[2], leading=12)
        y_etapa -= 36

    # Card 2: Contatos
    c.set_fill_rgb(*CYAN_LIGHT)
    c.set_stroke_rgb(*ELECTRIC_BLUE)
    c.rounded_rect(40, 100, 515, 215, r=8, fill=True, stroke=True)
    
    if has_logo:
        c.draw_image("LogoImg", 272.64, 262, 50, 50)
        c.draw_text(297.64, 245, "INFINITYTECH SERVICES", font="F2", size=13, r=NAVY[0], g=NAVY[1], b=NAVY[2], align="center")
    else:
        c.draw_text(297.64, 270, "INFINITYTECH SERVICES", font="F2", size=14, r=NAVY[0], g=NAVY[1], b=NAVY[2], align="center")
        
    c.draw_text(297.64, 228, "Engenharia de Software & Soluções Digitais Especiais", font="F3", size=10, r=GRAY_TEXT[0], g=GRAY_TEXT[1], b=GRAY_TEXT[2], align="center")

    c.set_stroke_rgb(*ELECTRIC_BLUE)
    c.set_line_width(1)
    c.line(80, 215, 515, 215)

    c.draw_text(297.64, 192, "Site Principal & Canal Oficial:", font="F2", size=10, r=NAVY[0], g=NAVY[1], b=NAVY[2], align="center")
    c.draw_text(297.64, 174, "www.infinitytechservices.com.br", font="F2", size=11, r=ELECTRIC_BLUE[0], g=ELECTRIC_BLUE[1], b=ELECTRIC_BLUE[2], align="center")

    c.draw_text(297.64, 148, "Atendimento Comercial & Suporte Dedicado aos Noivos", font="F1", size=9, r=DARK_TEXT[0], g=DARK_TEXT[1], b=DARK_TEXT[2], align="center")
    c.draw_text(297.64, 130, "InfinityTech Services • Transformando Momentos em Experiências Digitais", font="F3", size=8.5, r=GRAY_TEXT[0], g=GRAY_TEXT[1], b=GRAY_TEXT[2], align="center")

    pdf_bytes = c.generate_pdf_bytes(image_objs)
    output_path = os.path.join(os.getcwd(), "Apresentacao_Plataforma_Casamentos_InfinityTech.pdf")
    with open(output_path, "wb") as f:
        f.write(pdf_bytes)
    
    print(f"PDF atualizado com sucesso em: {output_path}")
    print(f"Tamanho total: {len(pdf_bytes)} bytes com {len(c.pages)} páginas.")

if __name__ == "__main__":
    build_presentation()
