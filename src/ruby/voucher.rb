require "pdfkit"
require "json"

class Voucher

  @@map = {}

  def generate(data)
    data = JSON.parse(data)
    pattern = "{{.*?}}"
    params = {"{{EXPERIENCIA}}" => data["experiencia"]["descricao"],
              "{{CLIENTE}}" => data["cliente"]["nome"],
              "{{PARCEIRO}}" => data["parceiro"]["nome"],
              "{{ENDERECO}}" => data["experiencia"]["local"],
              "{{CONTATOS}}" => data["parceiro"]["contatos"],
              "{{VALOR_PAGO}}" => data["valorBruto"],
              "{{NUMERO_VOUCHER}}" => data["codigo"],
              "{{TERMOS_DE_USO}}" => data["experiencia"]["termos"]}

    @key = "voucher-#{params['{{NUMERO_VOUCHER}}']}"
    @template = "src/views/templates/voucher.html"
    @out = File.open(@template).read.gsub(/#{pattern}/, params)
    @pdf = PDFKit.new(@out)
    @@map = {@key => @pdf.to_pdf}
    @key
  end

  def download(key)
    @pdf = @@map[key]
    @@map.delete(key)
    [200, {"Content-Type" => "application/pdf", "Content-Disposition" => "attachment"}, @pdf]
  end

end