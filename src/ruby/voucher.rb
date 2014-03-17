require "pdfkit"
require "launchy"

class Voucher

  def initialize
    @pdf = PDFKit.new(File.new("src/views/templates/voucher.html"))
  end

  def generate
    @pdf.to_file("files/voucher.pdf")
    Launchy::Browser.run("files/voucher.pdf")
  end

end