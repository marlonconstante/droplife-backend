require "pdfkit"
require "launchy"
require "json"

class Voucher

  def generate(data)
    data = JSON.parse(data)
    pattern = "{{.*?}}"
    params = {"{{EXPERIENCIA}}" => data["experiencia"]["descricao"],
              "{{CLIENTE}}" => data["cliente"]["nome"],
              "{{PARCEIRO}}" => data["experiencia"]["parceiro"]["nome"],
              "{{ENDERECO}}" => data["experiencia"]["local"],
              "{{CONTATOS}}" => data["experiencia"]["parceiro"]["contatos"],
              "{{VALOR_PAGO}}" => data["valorTotal"],
              "{{NUMERO_VOUCHER}}" => data["codigo"],
              "{{TERMOS_DE_USO}}" => data["experiencia"]["termos"]}

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