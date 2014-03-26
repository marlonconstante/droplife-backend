require "sinatra"
require_relative "security"
require_relative "orchestrate"
require_relative "voucher"
require_relative "pag_seguro"
require_relative "experience_detail"

get "/experiencia/detalhe/*" do |key|
  ExperienceDetail.new().map(key)
end

get "/parceiro/pesquisa" do
  protected!
  Orchestrate.new().search("Parceiro", "*")
end

post "/parceiro/salvar/*" do |key|
  protected!
  Orchestrate.new().save("Parceiro", key, request.body.read)
end

delete "/parceiro/remover/*" do |key|
  protected!
  Orchestrate.new().delete("Parceiro", key)
end

post "/voucher/generate" do
  protected!
  Voucher.new().generate(request.body.read);
end

get "/voucher/download/*" do |key|
  protected!
  Voucher.new().download(key);
end

get "/pagseguro/load/*" do |code|
  protected!
  PagSeguro.new().load(code);
end

get "/pagseguro/search" do
  protected!
  PagSeguro.new().search();
end

get "/cadastro/*/*" do |path, file|
  protected!
  send_file "src/#{path}/#{file}"
end

get "/" do
  redirect to("/cadastro/views/html/transacoes.html")
end