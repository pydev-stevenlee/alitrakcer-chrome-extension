function initAnalyticsConfig(a) {
    chrome.storage.local.get({ license: "", stats: !0 }, function (b) {
        a.setTrackingPermitted(b.stats);
    });
}
function getPages() {
    return;
    var a, b, c, d;
}
function addRow(a) {
    (title = $(a).find(".elements-title-normal__outter")),
    (gold = $(a).find(".seller-tag__year")),
    (company = $(a).find(".list-no-v2-decisionsup__element")),
    (price = $(a).find(".elements-offer-price-normal__price")),
    (moq = $(a).find(".element-offer-minorder-normal__value")),
    (unit = $(a).find(".element-shipping-price__unit")),
    (img = $(a).find(".J-img-switcher img").attr("src") ? $(a).find(".J-img-switcher img").attr("src") : $(a).find(".J-img-switcher img").data("src")),
    (goldTitle) = "",
    (priceTitle = price.text().trim()),
    (moqTitle = moq.text().trim()),
    
    c = "<tr>";
    c += '<td><img src="' + img + '" class="img-responsive" /></td>';
    c += '<td data-value="' + title.text().trim() + '">' + title.text().trim() + "</td>";
    c += '<td data-value="' + price.text().trim().split("-")[0] + '">$' + price.text().trim().split("-")[0] + "</td>";
    c += '<td data-value="' + price.text().trim().split("-")[1] + '">$' + price.text().trim().split("-")[1] + "</td>";
    c += '<td data-value="' + moq.text().trim() + '">' + moq.text().trim() + "</td>";
    c += '<td data-value="' + unit.text().trim() + '">' + unit.text().trim() + "</td>";
    c += '<td data-value="' + gold.text().trim() + '">' + gold.text().trim() + "</td>";
    c += '<td data-value="' + company.text().trim() + '">' + company.text().trim() + "</td>";

    (c += "</tr>"),

    $(".alitracker-popup tbody").append(c);
}
function countData() {
    var a = [];
    $(".tablesorter tbody tr").each(function () {
        a.push($(this).find("td:nth-child(8)").text());
    }),
        $("#cntFound").html($(".tablesorter tbody tr").length),
        $("#cntCompanies").html(a.unique().length),
        $("#cntMatched").html($(".tablesorter tbody tr").not(".filtered").length);
}
function numberWithCommas(a) {
    var b = a.toString().split(".");
    return (b[0] = b[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")), b.join(".");
}
function stristr(a, b, c) {
    var d = 0;
    return (a += ""), (d = a.toLowerCase().indexOf((b + "").toLowerCase())), -1 == d ? !1 : c ? a.substr(0, d) : a.slice(d);
}
function queryString(a) {
    a = a.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&");
    var b = location.search.match(new RegExp("[?&]" + a + "=([^&]+)(&|$)"));
    return b && decodeURIComponent(b[1].replace(/\+/g, " "));
}
var tabUrl = window.location.href,
    currentTld = location.hostname.split(".").reverse()[0] ? location.hostname.split(".").reverse()[0] : "com",
    currentCurrency = "uk" == currentTld ? "£" : "$",
    currentBaseUrl = "http://" + location.hostname,
    imagesPath = chrome.extension.getURL("img"),
    popupPath = chrome.extension.getURL("popup.html"),
    priceTitle,
    moqTitle,
    moqUnit,
    goldTitle,
    price1 = "",
    price2 = "",
    cnt = 1,
    popup = $("<section class='alitracker-popup'></section>"),
    search = $("#J-bc-search .textfield").val();

chrome.storage.local.set({ license: "forever", auth: !0 });
chrome.runtime.onConnect.addListener(function (a) {
    "jsPopupChannel" == a.name &&
        a.onMessage.addListener(function (a) {
            "openCloseJsPopup" == a.action && ($(".alitracker-popup").is(":visible") ? $(".alitracker-popup").fadeOut() : ($(".alitracker-popup").fadeIn(), getPages()));
        });
});
var service, tracker;
var test = $("body").text();

$(function () {
    (service = analytics.getService("alitracker")),
        service.getConfig().addCallback(initAnalyticsConfig),
        (tracker = service.getTracker("UA-65780133-1")),
        $("body").after(popup),

        $(".alitracker-popup").load(popupPath, function () {
            if (($("#logo").attr("src", imagesPath + "/logo.png"), (items = $("body").find(".m-gallery-product-item-v2")), items.length)) {
                $.each(items, function () {
                    addRow(this);
                });
                var a =
                    ($(".tablesorter").tablesorter({
                        widgets: ["zebra", "filter", "stickyHeaders", "group"],
                        widgetOptions: { filter_columnFilters: !0, stickyHeaders_attachTo: ".wrapper" },
                        textExtraction: function (a) {
                            var b = $(a).text(),
                                c = $(a).data("value");
                            return void 0 != c ? c : b;
                        },
                    }),
                    $(".tablesorter").find("input.tablesorter-filter"));
                $(".priceEmpty").click(function () {
                    $(this).is(":checked") ? a.eq(2, 3).val(">0").trigger("search", !1) : a.eq(2, 3).val("").trigger("keyup"), countData();
                }),
                    $(".moqEmpty").click(function () {
                        $(this).is(":checked") ? a.eq(4).val(">0").trigger("search", !1) : a.eq(4).val("").trigger("keyup"), countData();
                    }),
                    $("#priceMin").change(function () {
                        $(this).val()
                            ? a
                                  .eq(2)
                                  .val(">" + $(this).val())
                                  .trigger("search", !1)
                            : a.eq(2).val("").trigger("keyup"),
                            countData();
                    }),
                    $("#priceMax").change(function () {
                        $(this).val()
                            ? a
                                  .eq(3)
                                  .val("<" + $(this).val())
                                  .trigger("search", !1)
                            : a.eq(3).val("").trigger("keyup"),
                            countData();
                    }),
                    $("#goldMin").change(function () {
                        $(this).val()
                            ? a
                                  .eq(6)
                                  .val(">=" + $(this).val())
                                  .trigger("search", !1)
                            : a.eq(6).val("").trigger("keyup"),
                            countData();
                    }),
                    $("#moqMax").change(function () {
                        $(this).val()
                            ? a
                                  .eq(4)
                                  .val("<" + $(this).val())
                                  .trigger("search", !1)
                            : a.eq(4).val("").trigger("keyup"),
                            countData();
                    }),
                    $(".tablesorter tbody").on("mouseenter", "td:nth-child(2)", function () {
                        (img = $(this).parent().find("img").attr("src")), (offset = $(this).position()), $(".img-preview img").attr("src", img), $(".img-preview").show(), $(".img-preview").css({ top: offset.top });
                    }),
                    $(".tablesorter tbody").on("mouseleave", "td:nth-child(2)", function () {
                        $(".img-preview").hide();
                    }),
                    countData(),
                    $(".tablesorter").trigger("update");
            }
        });
}),
    (Array.prototype.unique = function () {
        for (var a = [], b = 0; b < this.length; b++) -1 == a.indexOf(this[b]) && a.push(this[b]);
        return a;
    });
