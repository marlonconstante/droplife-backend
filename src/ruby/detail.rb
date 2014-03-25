require "nokogiri"
require "open-uri"

class Detail
  URL = "http://droplife.com.br/views/html/detail"

  def map(key)
    doc = Nokogiri::HTML(open("#{URL}-#{key}.html"))
    {:termsOfUse => doc.css("dl-box[name=\"Termos de uso\"] dl-list item").map { |item| "<li>" + item.text + "</li>" }.join("").strip,
     :local => doc.css("dl-box[name=\"LOCALIZAÇÃO\"]").map { |address| address.text }.join("").strip}.to_json
  end

end