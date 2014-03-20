require "active_support/all"

class PagSeguro
  URL = "https://ws.pagseguro.uol.com.br/v2/transactions"
  API_EMAIL = "cadastros@grouplighthouse.com"
  API_TOKEN = "3316A859549C4EE9B4864D16B58193DE"

  def load(code)
    url = "#{URL}/#{code}?email=#{API_EMAIL}&token=#{API_TOKEN}"
    requestXml(url)["transaction"].to_json
  end

  def search
    page = 1
    maxPageResults = 1000
    finalDate = 3.months.ago
    today = DateTime.now
    format = "%Y-%m-%dT%H:%M"

    transactions = []

    while (finalDate < today)
      initialDate = finalDate + 1.minutes
      finalDate += 29.days
      if (finalDate > today)
        finalDate = today
      end

      url = "#{URL}?initialDate=#{initialDate.strftime(format)}&finalDate=#{finalDate.strftime(format)}&page=#{page}&maxPageResults=#{maxPageResults}&email=#{API_EMAIL}&token=#{API_TOKEN}"
      xml = requestXml(url)

      if xml["transactionSearchResult"]["transactions"]
        transactions.concat xml["transactionSearchResult"]["transactions"]["transaction"]
      end
    end

    transactions.to_json
  end

  def requestXml(url)
    response = Net::HTTP.get_response(URI.parse(url)).body
    Hash.from_xml(response)
  end

end