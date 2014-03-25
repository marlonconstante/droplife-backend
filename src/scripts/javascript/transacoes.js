var domain = {
    experiencia: {
        identificador: ko.observable(""),
        descricao: ko.observable("")
    },
    parceiro: {
        identificador: ko.observable(""),
        nome: ko.observable(""),
        contatos: ko.observable("")
    },
    cliente: {
        nome: ko.observable(""),
        email: ko.observable(""),
        telefone: ko.observable("")
    },
    metodoPagamento: ko.observable(""),
    valorBruto: ko.observable(""),
    valorTaxa: ko.observable(""),
    valorLiquido: ko.observable(""),
    situacao: ko.observable(""),
    data: ko.observable(""),
    linkPagamento: ko.observable(""),
    codigo: ko.observable("")
};

var empty = {
    items: {
        item: {
            description: ""
        }
    },
    partner: {
        nome: "Indefinido",
        contatos: []
    },
    sender: {
        name: "",
        email: "",
        phone: {
            areaCode: "",
            number: ""
        }
    },
    paymentMethod: {
        type: ""
    },
    grossAmount: "",
    feeAmount: "",
    netAmount: "",
    status: "",
    date: "",
    paymentLink: "",
    code: ""
};

var model = {
    selected: domain,
    empty: empty,
    init: function () {
        moment.lang("pt-BR");

        accounting.settings.currency.symbol = "R$ ";
        accounting.settings.currency.decimal = ",";
        accounting.settings.currency.thousand = ".";

        var $table = $("table");

        var oTable = $table.dataTable({
            aoColumns: [
                { mData: "date", sType: "moment", mRender: model.renderDate },
                { mData: "paymentMethod.type", mRender: model.renderPaymentMethod },
                { mData: "status", mRender: model.renderStatus },
                { mData: "grossAmount", sType: "accounting", mRender: model.renderMoney},
                { mData: "netAmount", sType: "accounting", mRender: model.renderMoney},
                { mData: "partner.nome" }
            ]
        });

        $table.find("tbody").on("click", "tr", function (event) {
            var $tr = $(this);
            var data = oTable.fnGetData(this);
            if (data) {
                if ($tr.hasClass("row-editing")) {
                    model.update();
                } else {
                    $.ajax({
                        type: "GET",
                        url: "/pagseguro/load/" + data.code
                    })
                        .done(function (transaction) {
                            transaction = JSON.parse(transaction);
                            transaction.partner = data.partner;
                            model.update(transaction);
                            $tr.addClass("row-editing");
                        });
                }
            }
        });

        $(window).on("resize", function () {
            oTable.fnAdjustColumnSizing();
        });
    },
    find: function () {
        var requestPartner = $.ajax({
            type: "GET",
            url: "/parceiro/pesquisa"
        });

        var requestPagSeguro = $.ajax({
            type: "GET",
            url: "/pagseguro/search"
        });

        $.when(requestPartner, requestPagSeguro).done(
            function (responsePartner, responsePagSeguro) {
                var partnerMap = {};
                var partners = JSON.parse(responsePartner[0]);
                for (var index = 0; index < partners.count; index++) {
                    var value = partners.results[index].value;
                    partnerMap[value.identificador] = value;
                }

                var transactions = JSON.parse(responsePagSeguro[0]);
                for (var index = 0; index < transactions.length; index++) {
                    transactions[index].partner = partnerMap[transactions[index].reference] || model.empty.partner;
                }

                var oTable = $("table").dataTable({ bRetrieve: true });
                oTable.fnClearTable();
                oTable.fnAddData(transactions);
            }
        );
    },
    update: function (value) {
        value = value || model.empty;

        var oTable = $("table").dataTable({ bRetrieve: true });
        oTable.$("tr.row-editing").removeClass("row-editing");

        model.detail(value.items.item.id);

        model.selected.parceiro.identificador(value.partner.identificador);
        model.selected.parceiro.nome(value.partner.nome);
        model.selected.parceiro.contatos(model.getPartnerContacts(value.partner.contatos));

        model.selected.experiencia.identificador(value.items.item.id);
        model.selected.experiencia.descricao(value.items.item.description);

        model.selected.cliente.nome(value.sender.name);
        model.selected.cliente.email(value.sender.email);
        model.selected.cliente.telefone(model.getPhoneNumber(value.sender.phone));

        model.selected.metodoPagamento(model.renderPaymentMethod(value.paymentMethod.type));
        model.selected.valorBruto(model.renderMoney(value.grossAmount));
        model.selected.valorTaxa(model.renderMoney(value.feeAmount));
        model.selected.valorLiquido(model.renderMoney(value.netAmount));

        model.selected.situacao(model.renderStatus(value.status));
        model.selected.data(model.renderDate(value.date));
        model.selected.linkPagamento(value.paymentLink);
        model.selected.codigo(value.code);

        oTable.fnAdjustColumnSizing();
    },
    generateVoucher: function () {
        var value = ko.toJS(model.selected);
        $.ajax({
            type: "POST",
            url: "/voucher/generate",
            data: JSON.stringify(value)
        });
    },
    detail: function (key) {
        $.ajax({
            type: "GET",
            url: "/detail/" + key
        }).done(function (data) {
                data = JSON.parse(data);
                model.selected.experiencia.termos = data.termsOfUse;
                model.selected.experiencia.local = data.local;
            });
    },
    getPartnerContacts: function (contacts) {
        var partnerContacts = "";
        for (var index = 0; index < contacts.length; index++) {
            if (contacts[index].telefone) {
                if (partnerContacts) {
                    partnerContacts += "<br>";
                }
                if (contacts[index].nome) {
                    partnerContacts += contacts[index].nome;
                    partnerContacts += " - ";
                }
                partnerContacts += "<a href='tel:";
                partnerContacts += contacts[index].telefone.replace(/\D/g, "");
                partnerContacts += "'>";
                partnerContacts += contacts[index].telefone;
                partnerContacts += "</a>";
            }
        }
        return partnerContacts || "Indefinido";
    },
    getPhoneNumber: function (phone) {
        var phoneNumber = "";
        if (phone && phone.number) {
            if (phone.areaCode) {
                phoneNumber = "(" + phone.areaCode + ") " + phone.number;
            } else {
                phoneNumber = phone.number;
            }
        }
        return phoneNumber;
    },
    renderDate: function (date) {
        if (date) {
            return moment(date).format("LLLL");
        }
    },
    renderMoney: function (money) {
        if (money) {
            return accounting.formatMoney(money);
        }
    },
    renderPaymentMethod: function (paymentMethod) {
        if (paymentMethod) {
            switch (Number(paymentMethod)) {
                case 1:
                    return "Cartão de crédito";
                case 2:
                    return "Boleto";
                case 3:
                    return "Débito online (TEF)";
                case 4:
                    return "Saldo PagSeguro";
                case 5:
                    return "Oi Paggo";
                case 7:
                    return "Depósito em conta";
                default:
                    return "Indefinido";
            }
        }
    },
    renderStatus: function (status) {
        if (status) {
            switch (Number(status)) {
                case 1:
                    return "Aguardando pagamento";
                case 2:
                    return "Em análise";
                case 3:
                    return "Paga";
                case 4:
                    return "Disponível";
                case 5:
                    return "Em disputa";
                case 6:
                    return "Devolvida";
                case 7:
                    return "Cancelada";
                default:
                    return "Indefinido";
            }
        }
    }
};

model.init();
model.find();
ko.applyBindings(model);