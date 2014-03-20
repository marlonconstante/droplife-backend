var model = {
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

            }
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
    report: function (value) {
        console.log(value);
    },
    renderDate: function(date) {
        return moment(date).format("LLLL");
    },
    renderMoney: function(money) {
        return accounting.formatMoney(money);
    },
    renderPaymentMethod: function (paymentMethod) {
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
    },
    renderStatus: function (status) {
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
};

model.init();
model.find();
ko.applyBindings(model);