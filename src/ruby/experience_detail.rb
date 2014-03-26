require "nokogiri"
require "open-uri"

class ExperienceDetail
  URL = "http://droplife.com.br/views/html/detail"

  def map(key)
    begin
      doc = Nokogiri::HTML(open("#{URL}-#{key}.html"))
      {:termsOfUse => doc.css("dl-box[name=\"Termos de uso\"] dl-list item").map { |item| "<li><span>" + item.text + "</span></li>" }.join("").strip,
       :local => doc.css("dl-box[name=\"LOCALIZAÇÃO\"]").map { |address| address.text }.join("").strip}.to_json
    rescue Exception => ex
      {:error => {:message => ex.message}}.to_json
    end
  end

end