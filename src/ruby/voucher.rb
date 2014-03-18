require "pdfkit"
require "launchy"

class Voucher

  def initialize
    pattern = "{{.*?}}"
    params = {"{{EXPERIENCIA}}" => "RAFTING AVENTURA",
              "{{CLIENTE}}" => "Patricia Tissiani",
              "{{PARCEIRO}}" => "Ecoaventuras",
              "{{ENDERECO}}" => "Rua Carlos Gomes, 190 - Centro - Tr&ecirc;s Coroas - RS",
              "{{CONTATOS}}" => "Édrei -  (51) 3546-4466",
              "{{VALOR_PAGO}}" => "R$ 525,00",
              "{{NUMERO_VOUCHER}}" => "862081CB-65BC-463A-A50A-170664DE2675"}

    @template = "src/views/templates/voucher.html"
    @outputHtml = "src/views/templates/voucher-#{params['{{NUMERO_VOUCHER}}']}.html"
    @outputPdf = "files/voucher-#{params['{{NUMERO_VOUCHER}}']}.pdf"

    File.open(@outputHtml, 'w') do |out|
      out << File.open(@template).read.gsub(/#{pattern}/, params)
    end

    @pdf = PDFKit.new(File.new(@outputHtml))
  end

  def generate
    @pdf.to_file(@outputPdf)
    Launchy::Browser.run(@outputPdf)

    File.delete(@outputHtml)
  end

end