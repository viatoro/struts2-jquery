/**
 * jqGrid extension for cellediting Grid Data
 * Tony Tomov tony@trirand.com
 * http://trirand.com/blog/
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
 **/
(function (a) {
    a.jgrid.extend({editCell: function (d, c, b) {
        return this.each(function () {
            var i = this, m, j, g, k;
            if (!i.grid || i.p.cellEdit !== true) {
                return
            }
            c = parseInt(c, 10);
            i.p.selrow = i.rows[d].id;
            if (!i.p.knv) {
                a(i).jqGrid("GridNav")
            }
            if (i.p.savedRow.length > 0) {
                if (b === true) {
                    if (d == i.p.iRow && c == i.p.iCol) {
                        return
                    }
                }
                a(i).jqGrid("saveCell", i.p.savedRow[0].id, i.p.savedRow[0].ic)
            } else {
                window.setTimeout(function () {
                    a("#" + a.jgrid.jqID(i.p.knv)).attr("tabindex", "-1").focus()
                }, 0)
            }
            k = i.p.colModel[c];
            m = k.name;
            if (m === "subgrid" || m === "cb" || m === "rn") {
                return
            }
            g = a("td:eq(" + c + ")", i.rows[d]);
            if (k.editable === true && b === true && !g.hasClass("not-editable-cell")) {
                if (parseInt(i.p.iCol, 10) >= 0 && parseInt(i.p.iRow, 10) >= 0) {
                    a("td:eq(" + i.p.iCol + ")", i.rows[i.p.iRow]).removeClass("edit-cell ui-state-highlight");
                    a(i.rows[i.p.iRow]).removeClass("selected-row ui-state-hover")
                }
                a(g).addClass("edit-cell ui-state-highlight");
                a(i.rows[d]).addClass("selected-row ui-state-hover");
                try {
                    j = a.unformat.call(i, g, {rowId: i.rows[d].id, colModel: k}, c)
                } catch (l) {
                    j = (k.edittype && k.edittype === "textarea") ? a(g).text() : a(g).html()
                }
                if (i.p.autoencode) {
                    j = a.jgrid.htmlDecode(j)
                }
                if (!k.edittype) {
                    k.edittype = "text"
                }
                i.p.savedRow.push({id: d, ic: c, name: m, v: j});
                if (j === "&nbsp;" || j === "&#160;" || (j.length === 1 && j.charCodeAt(0) === 160)) {
                    j = ""
                }
                if (a.isFunction(i.p.formatCell)) {
                    var h = i.p.formatCell.call(i, i.rows[d].id, m, j, d, c);
                    if (h !== undefined) {
                        j = h
                    }
                }
                a(i).triggerHandler("jqGridBeforeEditCell", [i.rows[d].id, m, j, d, c]);
                if (a.isFunction(i.p.beforeEditCell)) {
                    i.p.beforeEditCell.call(i, i.rows[d].id, m, j, d, c)
                }
                var f = a.extend({}, k.editoptions || {}, {id: d + "_" + m, name: m});
                var e = a.jgrid.createEl.call(i, k.edittype, f, j, true, a.extend({}, a.jgrid.ajaxOptions, i.p.ajaxSelectOptions || {}));
                a(g).html("").append(e).attr("tabindex", "0");
                a.jgrid.bindEv.call(i, e, f);
                window.setTimeout(function () {
                    a(e).focus()
                }, 0);
                a("input, select, textarea", g).bind("keydown", function (n) {
                    if (n.keyCode === 27) {
                        if (a("input.hasDatepicker", g).length > 0) {
                            if (a(".ui-datepicker").is(":hidden")) {
                                a(i).jqGrid("restoreCell", d, c)
                            } else {
                                a("input.hasDatepicker", g).datepicker("hide")
                            }
                        } else {
                            a(i).jqGrid("restoreCell", d, c)
                        }
                    }
                    if (n.keyCode === 13) {
                        a(i).jqGrid("saveCell", d, c);
                        return false
                    }
                    if (n.keyCode === 9) {
                        if (!i.grid.hDiv.loading) {
                            if (n.shiftKey) {
                                a(i).jqGrid("prevCell", d, c)
                            } else {
                                a(i).jqGrid("nextCell", d, c)
                            }
                        } else {
                            return false
                        }
                    }
                    n.stopPropagation()
                });
                a(i).triggerHandler("jqGridAfterEditCell", [i.rows[d].id, m, j, d, c]);
                if (a.isFunction(i.p.afterEditCell)) {
                    i.p.afterEditCell.call(i, i.rows[d].id, m, j, d, c)
                }
            } else {
                if (parseInt(i.p.iCol, 10) >= 0 && parseInt(i.p.iRow, 10) >= 0) {
                    a("td:eq(" + i.p.iCol + ")", i.rows[i.p.iRow]).removeClass("edit-cell ui-state-highlight");
                    a(i.rows[i.p.iRow]).removeClass("selected-row ui-state-hover")
                }
                g.addClass("edit-cell ui-state-highlight");
                a(i.rows[d]).addClass("selected-row ui-state-hover");
                j = g.html().replace(/\&#160\;/ig, "");
                a(i).triggerHandler("jqGridSelectCell", [i.rows[d].id, m, j, d, c]);
                if (a.isFunction(i.p.onSelectCell)) {
                    i.p.onSelectCell.call(i, i.rows[d].id, m, j, d, c)
                }
            }
            i.p.iCol = c;
            i.p.iRow = d
        })
    }, saveCell: function (c, b) {
        return this.each(function () {
            var u = this, h;
            if (!u.grid || u.p.cellEdit !== true) {
                return
            }
            if (u.p.savedRow.length >= 1) {
                h = 0
            } else {
                h = null
            }
            if (h !== null) {
                var p = a("td:eq(" + b + ")", u.rows[c]), n, d, j = u.p.colModel[b], f = j.name, i = a.jgrid.jqID(f);
                switch (j.edittype) {
                    case"select":
                        if (!j.editoptions.multiple) {
                            n = a("#" + c + "_" + i + " option:selected", u.rows[c]).val();
                            d = a("#" + c + "_" + i + " option:selected", u.rows[c]).text()
                        } else {
                            var t = a("#" + c + "_" + i, u.rows[c]), s = [];
                            n = a(t).val();
                            if (n) {
                                n.join(",")
                            } else {
                                n = ""
                            }
                            a("option:selected", t).each(function (e, v) {
                                s[e] = a(v).text()
                            });
                            d = s.join(",")
                        }
                        if (j.formatter) {
                            d = n
                        }
                        break;
                    case"checkbox":
                        var q = ["Yes", "No"];
                        if (j.editoptions) {
                            q = j.editoptions.value.split(":")
                        }
                        n = a("#" + c + "_" + i, u.rows[c]).is(":checked") ? q[0] : q[1];
                        d = n;
                        break;
                    case"password":
                    case"text":
                    case"textarea":
                    case"button":
                        n = a("#" + c + "_" + i, u.rows[c]).val();
                        d = n;
                        break;
                    case"custom":
                        try {
                            if (j.editoptions && a.isFunction(j.editoptions.custom_value)) {
                                n = j.editoptions.custom_value.call(u, a(".customelement", p), "get");
                                if (n === undefined) {
                                    throw"e2"
                                } else {
                                    d = n
                                }
                            } else {
                                throw"e1"
                            }
                        } catch (w) {
                            if (w === "e1") {
                                a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.nodefined, a.jgrid.edit.bClose)
                            }
                            if (w === "e2") {
                                a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.novalue, a.jgrid.edit.bClose)
                            } else {
                                a.jgrid.info_dialog(a.jgrid.errors.errcap, w.message, a.jgrid.edit.bClose)
                            }
                        }
                        break
                }
                if (d !== u.p.savedRow[h].v) {
                    var y = a(u).triggerHandler("jqGridBeforeSaveCell", [u.rows[c].id, f, n, c, b]);
                    if (y) {
                        n = y;
                        d = y
                    }
                    if (a.isFunction(u.p.beforeSaveCell)) {
                        var r = u.p.beforeSaveCell.call(u, u.rows[c].id, f, n, c, b);
                        if (r) {
                            n = r;
                            d = r
                        }
                    }
                    var g = a.jgrid.checkValues.call(u, n, b);
                    if (g[0] === true) {
                        var l = a(u).triggerHandler("jqGridBeforeSubmitCell", [u.rows[c].id, f, n, c, b]) || {};
                        if (a.isFunction(u.p.beforeSubmitCell)) {
                            l = u.p.beforeSubmitCell.call(u, u.rows[c].id, f, n, c, b);
                            if (!l) {
                                l = {}
                            }
                        }
                        if (a("input.hasDatepicker", p).length > 0) {
                            a("input.hasDatepicker", p).datepicker("hide")
                        }
                        if (u.p.cellsubmit === "remote") {
                            if (u.p.cellurl) {
                                var x = {};
                                if (u.p.autoencode) {
                                    n = a.jgrid.htmlEncode(n)
                                }
                                x[f] = n;
                                var o, m, k;
                                k = u.p.prmNames;
                                o = k.id;
                                m = k.oper;
                                x[o] = a.jgrid.stripPref(u.p.idPrefix, u.rows[c].id);
                                x[m] = k.editoper;
                                x = a.extend(l, x);
                                a("#lui_" + a.jgrid.jqID(u.p.id)).show();
                                u.grid.hDiv.loading = true;
                                a.ajax(a.extend({url: u.p.cellurl, data: a.isFunction(u.p.serializeCellData) ? u.p.serializeCellData.call(u, x) : x, type: "POST", complete: function (e, z) {
                                    a("#lui_" + u.p.id).hide();
                                    u.grid.hDiv.loading = false;
                                    if (z === "success") {
                                        var v = a(u).triggerHandler("jqGridAfterSubmitCell", [u, e, x.id, f, n, c, b]) || [true, ""];
                                        if (v[0] === true && a.isFunction(u.p.afterSubmitCell)) {
                                            v = u.p.afterSubmitCell.call(u, e, x.id, f, n, c, b)
                                        }
                                        if (v[0] === true) {
                                            a(p).empty();
                                            a(u).jqGrid("setCell", u.rows[c].id, b, d, false, false, true);
                                            a(p).addClass("dirty-cell");
                                            a(u.rows[c]).addClass("edited");
                                            a(u).triggerHandler("jqGridAfterSaveCell", [u.rows[c].id, f, n, c, b]);
                                            if (a.isFunction(u.p.afterSaveCell)) {
                                                u.p.afterSaveCell.call(u, u.rows[c].id, f, n, c, b)
                                            }
                                            u.p.savedRow.splice(0, 1)
                                        } else {
                                            a.jgrid.info_dialog(a.jgrid.errors.errcap, v[1], a.jgrid.edit.bClose);
                                            a(u).jqGrid("restoreCell", c, b)
                                        }
                                    }
                                }, error: function (e, v, z) {
                                    a("#lui_" + a.jgrid.jqID(u.p.id)).hide();
                                    u.grid.hDiv.loading = false;
                                    a(u).triggerHandler("jqGridErrorCell", [e, v, z]);
                                    if (a.isFunction(u.p.errorCell)) {
                                        u.p.errorCell.call(u, e, v, z);
                                        a(u).jqGrid("restoreCell", c, b)
                                    } else {
                                        a.jgrid.info_dialog(a.jgrid.errors.errcap, e.status + " : " + e.statusText + "<br/>" + v, a.jgrid.edit.bClose);
                                        a(u).jqGrid("restoreCell", c, b)
                                    }
                                }}, a.jgrid.ajaxOptions, u.p.ajaxCellOptions || {}))
                            } else {
                                try {
                                    a.jgrid.info_dialog(a.jgrid.errors.errcap, a.jgrid.errors.nourl, a.jgrid.edit.bClose);
                                    a(u).jqGrid("restoreCell", c, b)
                                } catch (w) {
                                }
                            }
                        }
                        if (u.p.cellsubmit === "clientArray") {
                            a(p).empty();
                            a(u).jqGrid("setCell", u.rows[c].id, b, d, false, false, true);
                            a(p).addClass("dirty-cell");
                            a(u.rows[c]).addClass("edited");
                            a(u).triggerHandler("jqGridAfterSaveCell", [u.rows[c].id, f, n, c, b]);
                            if (a.isFunction(u.p.afterSaveCell)) {
                                u.p.afterSaveCell.call(u, u.rows[c].id, f, n, c, b)
                            }
                            u.p.savedRow.splice(0, 1)
                        }
                    } else {
                        try {
                            window.setTimeout(function () {
                                a.jgrid.info_dialog(a.jgrid.errors.errcap, n + " " + g[1], a.jgrid.edit.bClose)
                            }, 100);
                            a(u).jqGrid("restoreCell", c, b)
                        } catch (w) {
                        }
                    }
                } else {
                    a(u).jqGrid("restoreCell", c, b)
                }
            }
            window.setTimeout(function () {
                a("#" + a.jgrid.jqID(u.p.knv)).attr("tabindex", "-1").focus()
            }, 0)
        })
    }, restoreCell: function (c, b) {
        return this.each(function () {
            var h = this, d;
            if (!h.grid || h.p.cellEdit !== true) {
                return
            }
            if (h.p.savedRow.length >= 1) {
                d = 0
            } else {
                d = null
            }
            if (d !== null) {
                var g = a("td:eq(" + b + ")", h.rows[c]);
                if (a.isFunction(a.fn.datepicker)) {
                    try {
                        a("input.hasDatepicker", g).datepicker("hide")
                    } catch (f) {
                    }
                }
                a(g).empty().attr("tabindex", "-1");
                a(h).jqGrid("setCell", h.rows[c].id, b, h.p.savedRow[d].v, false, false, true);
                a(h).triggerHandler("jqGridAfterRestoreCell", [h.rows[c].id, h.p.savedRow[d].v, c, b]);
                if (a.isFunction(h.p.afterRestoreCell)) {
                    h.p.afterRestoreCell.call(h, h.rows[c].id, h.p.savedRow[d].v, c, b)
                }
                h.p.savedRow.splice(0, 1)
            }
            window.setTimeout(function () {
                a("#" + h.p.knv).attr("tabindex", "-1").focus()
            }, 0)
        })
    }, nextCell: function (c, b) {
        return this.each(function () {
            var f = this, e = false, d;
            if (!f.grid || f.p.cellEdit !== true) {
                return
            }
            for (d = b + 1; d < f.p.colModel.length; d++) {
                if (f.p.colModel[d].editable === true) {
                    e = d;
                    break
                }
            }
            if (e !== false) {
                a(f).jqGrid("editCell", c, e, true)
            } else {
                if (f.p.savedRow.length > 0) {
                    a(f).jqGrid("saveCell", c, b)
                }
            }
        })
    }, prevCell: function (c, b) {
        return this.each(function () {
            var f = this, e = false, d;
            if (!f.grid || f.p.cellEdit !== true) {
                return
            }
            for (d = b - 1; d >= 0; d--) {
                if (f.p.colModel[d].editable === true) {
                    e = d;
                    break
                }
            }
            if (e !== false) {
                a(f).jqGrid("editCell", c, e, true)
            } else {
                if (f.p.savedRow.length > 0) {
                    a(f).jqGrid("saveCell", c, b)
                }
            }
        })
    }, GridNav: function () {
        return this.each(function () {
            var g = this;
            if (!g.grid || g.p.cellEdit !== true) {
                return
            }
            g.p.knv = g.p.id + "_kn";
            var f = a("<div style='position:fixed;top:0px;width:1px;height:1px;' tabindex='0'><div tabindex='-1' style='width:1px;height:1px;' id='" + g.p.knv + "'></div></div>"), d, c;

            function e(p, n, o) {
                if (o.substr(0, 1) === "v") {
                    var h = a(g.grid.bDiv)[0].clientHeight, q = a(g.grid.bDiv)[0].scrollTop, r = g.rows[p].offsetTop + g.rows[p].clientHeight, l = g.rows[p].offsetTop;
                    if (o === "vd") {
                        if (r >= h) {
                            a(g.grid.bDiv)[0].scrollTop = a(g.grid.bDiv)[0].scrollTop + g.rows[p].clientHeight
                        }
                    }
                    if (o === "vu") {
                        if (l < q) {
                            a(g.grid.bDiv)[0].scrollTop = a(g.grid.bDiv)[0].scrollTop - g.rows[p].clientHeight
                        }
                    }
                }
                if (o === "h") {
                    var k = a(g.grid.bDiv)[0].clientWidth, j = a(g.grid.bDiv)[0].scrollLeft, i = g.rows[p].cells[n].offsetLeft + g.rows[p].cells[n].clientWidth, m = g.rows[p].cells[n].offsetLeft;
                    if (i >= k + parseInt(j, 10)) {
                        a(g.grid.bDiv)[0].scrollLeft = a(g.grid.bDiv)[0].scrollLeft + g.rows[p].cells[n].clientWidth
                    } else {
                        if (m < j) {
                            a(g.grid.bDiv)[0].scrollLeft = a(g.grid.bDiv)[0].scrollLeft - g.rows[p].cells[n].clientWidth
                        }
                    }
                }
            }

            function b(l, h) {
                var k, j;
                if (h === "lft") {
                    k = l + 1;
                    for (j = l; j >= 0; j--) {
                        if (g.p.colModel[j].hidden !== true) {
                            k = j;
                            break
                        }
                    }
                }
                if (h === "rgt") {
                    k = l - 1;
                    for (j = l; j < g.p.colModel.length; j++) {
                        if (g.p.colModel[j].hidden !== true) {
                            k = j;
                            break
                        }
                    }
                }
                return k
            }

            a(f).insertBefore(g.grid.cDiv);
            a("#" + g.p.knv).focus().keydown(function (h) {
                c = h.keyCode;
                if (g.p.direction === "rtl") {
                    if (c === 37) {
                        c = 39
                    } else {
                        if (c === 39) {
                            c = 37
                        }
                    }
                }
                switch (c) {
                    case 38:
                        if (g.p.iRow - 1 > 0) {
                            e(g.p.iRow - 1, g.p.iCol, "vu");
                            a(g).jqGrid("editCell", g.p.iRow - 1, g.p.iCol, false)
                        }
                        break;
                    case 40:
                        if (g.p.iRow + 1 <= g.rows.length - 1) {
                            e(g.p.iRow + 1, g.p.iCol, "vd");
                            a(g).jqGrid("editCell", g.p.iRow + 1, g.p.iCol, false)
                        }
                        break;
                    case 37:
                        if (g.p.iCol - 1 >= 0) {
                            d = b(g.p.iCol - 1, "lft");
                            e(g.p.iRow, d, "h");
                            a(g).jqGrid("editCell", g.p.iRow, d, false)
                        }
                        break;
                    case 39:
                        if (g.p.iCol + 1 <= g.p.colModel.length - 1) {
                            d = b(g.p.iCol + 1, "rgt");
                            e(g.p.iRow, d, "h");
                            a(g).jqGrid("editCell", g.p.iRow, d, false)
                        }
                        break;
                    case 13:
                        if (parseInt(g.p.iCol, 10) >= 0 && parseInt(g.p.iRow, 10) >= 0) {
                            a(g).jqGrid("editCell", g.p.iRow, g.p.iCol, true)
                        }
                        break;
                    default:
                        return true
                }
                return false
            })
        })
    }, getChangedCells: function (c) {
        var b = [];
        if (!c) {
            c = "all"
        }
        this.each(function () {
            var e = this, d;
            if (!e.grid || e.p.cellEdit !== true) {
                return
            }
            a(e.rows).each(function (f) {
                var g = {};
                if (a(this).hasClass("edited")) {
                    a("td", this).each(function (h) {
                        d = e.p.colModel[h].name;
                        if (d !== "cb" && d !== "subgrid") {
                            if (c === "dirty") {
                                if (a(this).hasClass("dirty-cell")) {
                                    try {
                                        g[d] = a.unformat.call(e, this, {rowId: e.rows[f].id, colModel: e.p.colModel[h]}, h)
                                    } catch (j) {
                                        g[d] = a.jgrid.htmlDecode(a(this).html())
                                    }
                                }
                            } else {
                                try {
                                    g[d] = a.unformat.call(e, this, {rowId: e.rows[f].id, colModel: e.p.colModel[h]}, h)
                                } catch (j) {
                                    g[d] = a.jgrid.htmlDecode(a(this).html())
                                }
                            }
                        }
                    });
                    g.id = this.id;
                    b.push(g)
                }
            })
        });
        return b
    }})
})(jQuery);
