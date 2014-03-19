var model = {
    init: function () {
        var $table = $("table");

        var oTable = $table.dataTable({
            aoColumns: [
                { mData: "date" },
                { mData: "paymentMethod.type", mRender: model.renderPaymentMethod },
                { mData: "status", mRender: model.renderStatus },
                { mData: "grossAmount" },
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
    }
};

model.init();
model.find();
ko.applyBindings(model);