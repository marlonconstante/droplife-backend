require "pdfkit"
require "launchy"
require "json"

class Voucher

  def initialize
  end

  def generate(data)
    data = JSON.parse(data)
    pattern = "{{.*?}}"
    params = {"{{EXPERIENCIA}}" => data["experiencia"]["descricao"],
              "{{CLIENTE}}" => data["cliente"]["nome"],
              "{{PARCEIRO}}" => "Ecoaventuras",
              "{{ENDERECO}}" => "Rua Carlos Gomes, 190 - Centro - Tr&ecirc;s Coroas - RS",
              "{{CONTATOS}}" => "Édrei -  (51) 3546-4466",
              "{{VALOR_PAGO}}" => data["valorTotal"],
              "{{NUMERO_VOUCHER}}" => data["codigo"]}

    @template = "src/views/templates/voucher.html"
    @outputHtml = "src/views/templates/voucher-#{params['{{NUMERO_VOUCHER}}']}.html"
    @outputPdf = "files/voucher-#{params['{{NUMERO_VOUCHER}}']}.pdf"

    File.open(@outputHtml, 'w') do |out|
      out << File.open(@template).read.gsub(/#{pattern}/, params)
    end

    @pdf = PDFKit.new(File.new(@outputHtml))


    @pdf.to_file(@outputPdf)
    Launchy::Browser.run(@outputPdf)

    File.delete(@outputHtml)
  end

end