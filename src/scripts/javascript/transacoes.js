var domain = {
    experiencia: {
        descricao: ko.observable("")
    },
    cliente: {
        nome: ko.observable(""),
        email: ko.observable(""),
        telefone: ko.observable("")
    },
    metodoPagamento: ko.observable(""),
    valorTotal: ko.observable(""),
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
                { mData: "code" }
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
                        .done(function (value) {
                            model.update(JSON.parse(value));
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
        $.ajax({
            type: "GET",
            url: "/pagseguro/search"
        })
            .done(function (data) {
                var values = JSON.parse(data);

                var oTable = $("table").dataTable({ bRetrieve: true });
                oTable.fnClearTable();
                oTable.fnAddData(values);
            });
    },
    update: function (value) {
        value = value || model.empty;

        var oTable = $("table").dataTable({ bRetrieve: true });
        oTable.$("tr.row-editing").removeClass("row-editing");

        model.selected.experiencia.descricao(value.items.item.description);
        model.selected.cliente.nome(value.sender.name);
        model.selected.cliente.email(value.sender.email);
        model.selected.cliente.telefone(model.getPhoneNumber(value.sender.phone));
        model.selected.metodoPagamento(model.renderPaymentMethod(value.paymentMethod.type));
        model.selected.valorTotal(model.renderMoney(value.grossAmount));
        model.selected.valorTaxa(model.renderMoney(value.feeAmount));
        model.selected.valorLiquido(model.renderMoney(value.netAmount));
        model.selected.situacao(model.renderStatus(value.status));
        model.selected.data(model.renderDate(value.date));
        model.selected.linkPagamento(value.paymentLink);
        model.selected.codigo(value.code);

        oTable.fnAdjustColumnSizing();
    },
    generateVoucher: function (value) {
        console.log(value);
        $.ajax({
            type: "GET",
            url: "/voucher/generate"
        });
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