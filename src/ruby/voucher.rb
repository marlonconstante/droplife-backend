require "pdfkit"
require "json"

class Voucher

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

    @template = "src/views/templates/voucher.html"
    @outfile = File.open(@template).read.gsub(/#{pattern}/, params)
    @pdf = PDFKit.new(@outfile)

    [200, {"Content-Type" => "application/pdf", "Content-Disposition" => "attachment", "filename" => "voucher.pdf"}, @pdf.to_pdf]
  end

end