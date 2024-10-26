! function(s) {
    var o = s.document,
        e = function(a) {
            (a = s.zgssearch || {}).userAgent = s.navigator.userAgent, a.isIE = -1 !== a.userAgent.indexOf("MSIE") || -1 !== a.userAgent.indexOf("Trident"), a.isLinux = -1 !== a.userAgent.indexOf("Linux") || -1 !== a.userAgent.indexOf("Linux"), a.isWindows = -1 !== a.userAgent.indexOf("Win") || -1 !== a.userAgent.indexOf("Win"), a.detectBrowser = function() {
                return -1 != (a.userAgent.indexOf("Opera") || a.userAgent.indexOf("OPR")) ? "Opera" : -1 != a.userAgent.indexOf("Edg") ? "Edge" : -1 != a.userAgent.indexOf("Chrome") ? "Chrome" : -1 != a.userAgent.indexOf("Safari") ? "Safari" : -1 != a.userAgent.indexOf("Firefox") ? "Firefox" : -1 != a.userAgent.indexOf("MSIE") || 1 == !!o.documentMode ? "IE" : "Unknown"
            }, a.detectBrowserVersion = function() {
                var e, t = a.userAgent,
                    n = t.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
                return /trident/i.test(n[1]) ? {
                    name: "IE",
                    version: (e = /\brv[ :]+(\d+)/g.exec(t) || [])[1] || ""
                } : "Chrome" === n[1] && null != (e = t.match(/\b(OPR|Edge)\/(\d+)/)) ? {
                    name: e[1].replace("OPR", "Opera"),
                    version: e[2]
                } : (n = n[2] ? [n[1], n[2]] : [navigator.appName, navigator.appVersion, "-?"], null != (e = t.match(/version\/(\d+)/i)) && n.splice(1, 1, e[1]), {
                    name: n[0],
                    version: n[1]
                })
            }, a.ZSNetwork = {
                imageRenderer: {
                    renderImage: function(e, t, n) {
                        t ? a.renderPhoto("", e, t.class_name, t.errorClass, t.img_elem) : n(e)
                    }
                },
                getSearchResultsForSSE: function(e) {
                    a.eventSource = new EventSource(e), a.eventSource.addEventListener("initial_Weightage", function(e) {
                        a.handleSearchResults("IWEIGHT", e.data)
                    }), a.eventSource.addEventListener("version", function(e) {
                        a.handleSearchResults("VERSION", e.data)
                    }), a.eventSource.addEventListener("result", function(e) {
                        a.handleSearchResults("RESULT", e.data)
                    }), a.eventSource.addEventListener("nlp_tracer", function(e) {
                        a.gsnlpsearch.storeNLPTracerData(e.data)
                    }), a.eventSource.addEventListener("weightage", function(e) {
                        a.handleSearchResults("WEIGHT", e.data)
                    }), a.eventSource.onmessage = function(e) {
                        a.network.removeEventSource(), a.handleSearchResults("CLOSE", e)
                    }, a.eventSource.onerror = function(e) {
                        a.network.removeEventSource(), a.handleSearchResults("ERROR", e)
                    }
                },
                abortOngoingCalls: function() {
                    a.abortXMLHTTPReq(a.xmlhttpReq), a.network.removeEventSource()
                },
                abortOngoingCalloutCalls: function() {
                    a.abortXMLHTTPReq(a.xmlhttpCalloutReq), a.network.removeEventSource()
                },
                abortOngoingAdvSearchCalls: function() {
                    a.abortXMLHTTPReq(a.advSearchXMLHttpReq), a.network.removeEventSource()
                },
                removeEventSource: function() {
                    void 0 !== a.eventSource && (a.eventSource.close(), a.eventSource = void 0)
                },
                xmlHttpReq: function(e, t, n, r) {
                    n && a.abortXMLHTTPReq(a.xmlhttpReq), a.xmlhttpReq = a.getRequestObject(), a.xmlhttpReq.onreadystatechange = function(e) {
                        4 === a.xmlhttpReq.readyState && (200 === a.xmlhttpReq.status ? r({
                            response: a.xmlhttpReq.responseText,
                            status: "success",
                            result: a.xmlhttpReq,
                            args: a.xmlhttpReq.args
                        }) : r({
                            response: e,
                            status: "error",
                            result: a.xmlhttpReq,
                            args: a.xmlhttpReq.args
                        }))
                    }, a.xmlhttpReq.open(e, t, !0), a.xmlhttpReq.send()
                },
                uri: function(t) {
                    if ("POST" !== t.type && "DELETE" !== t.type) return s._jQueryGS.ajax(t);
                    a.network.getCookie("CSRF_TOKEN", function(e) {
                        return t.data = void 0 !== t.data ? t.data += "&" + GSConstant.csrfName + "=" + e : e, s._jQueryGS.ajax(t)
                    })
                },
                upload_file: function(n) {
                    "POST" === n.method && a.network.getCookie("CSRF_TOKEN", function(e) {
                        var t = n.data;
                        e && t.append(GSConstant.csrfName, e)
                    }), s._jQueryGS.ajax(n)
                },
                download_file: function(e) {
                    var t = o.createElement("iframe");
                    t.frameBorder = 0, t.id = "download_iframe", t.src = e, t.style = "display:none";
                    e = a.isPreviewOpenedInComponent ? "zgs20_pcSearch" : "zgs20_globalsearch";
                    o.getElementById(e).appendChild(t), setTimeout(function() {
                        t.parentElement.removeChild(t)
                    }, 5e4)
                },
                getFingerPrintFilePath: function(e, t) {
                    var n = "embeddashboards" === t ? t : a.GSConstant.BUILD_DATE,
                        n = s.location.protocol + "//" + a.GSConstant.STATIC_RESOURCE_SERVER + "/" + a.gscomponent.gsserver + "/" + n + "/";
                    return a.gscomponent.hasOwnProperty("isFingerprintEnabled") && a.gscomponent.isFingerprintEnabled && a.gscomponent.hasOwnProperty(e) ? "embeddashboards" === t ? a.gsbuildDetails[e] : n + a.gsbuildDetails[e] : n + e
                },
                setIntegrityValue: function(e, t) {
                    e.setAttribute("integrity", t), e.setAttribute("crossorigin", "anonymous")
                },
                loadSRICSSFile: function(e, t, n) {
                    var r, s;
                    e && (s = r = "", -1 < e.indexOf("wmsbar") ? (r = e, s = wms_css_url_integrity || "") : r = a.network.getFingerPrintFilePath(e, n), e = a.gsbuildDetails.hasOwnProperty("checksums") && a.gsbuildDetails.checksums.hasOwnProperty(e) ? a.gsbuildDetails.checksums[e] : s, (s = o.createElement("link")).setAttribute("rel", "stylesheet"), s.setAttribute("type", "text/css"), e && a.network.setIntegrityValue(s, e), s.setAttribute("href", r), s.onload = function() {
                        a.cssLoaded || (a.cssLoaded = !0), t && t()
                    }, o.getElementsByTagName("head").item(0).appendChild(s))
                },
                loadSRIJSFile: function(e, t, n) {
                    var r, s;
                    e && (s = r = "", -1 < e.indexOf("wmsbar") ? (r = e, s = wms_js_url_integrity || "") : r = a.network.getFingerPrintFilePath(e, n), s = -1 < e.indexOf("workdrive-components-v1") ? a.workdrive_component_integrity : s, e = a.gsbuildDetails.hasOwnProperty("checksums") && a.gsbuildDetails.checksums.hasOwnProperty(e) ? a.gsbuildDetails.checksums[e] : s, (s = o.createElement("script")).setAttribute("type", "text/javascript"), e && a.network.setIntegrityValue(s, e), s.setAttribute("src", r), s.onload = function() {
                        t && t()
                    }, o.getElementsByTagName("head").item(0).appendChild(s))
                },
                loadSRIJSFileForFingerprintedURL: function(e, t) {
                    var n, r;
                    e && (n = a.gsbuildDetails.hasOwnProperty("checksums") && a.gsbuildDetails.checksums.hasOwnProperty(e) ? a.gsbuildDetails.checksums[e] : "", (r = o.createElement("script")).setAttribute("type", "text/javascript"), n && "" != n && a.network.setIntegrityValue(r, n), e = a.gsbuildDetails.hasOwnProperty(e) && a.gsbuildDetails[e], e = s.location.protocol + "//" + a.GSConstant.STATIC_RESOURCE_SERVER + e, r.setAttribute("src", e), r.onload = function() {
                        t && t()
                    }, o.getElementsByTagName("head").item(0).appendChild(r))
                },
                loadCSSFile: function(e, t) {
                    var n;
                    e && ((n = o.createElement("link")).setAttribute("rel", "stylesheet"), n.setAttribute("type", "text/css"), n.setAttribute("href", e), n.onload = function() {
                        a.cssLoaded || (a.cssLoaded = !0), t && t()
                    }, o.getElementsByTagName("head").item(0).appendChild(n))
                },
                loadJSFile: function(e, t) {
                    var n = o.createElement("script");
                    n.setAttribute("type", "text/javascript"), n.setAttribute("src", e), n.onload = function() {
                        t && t()
                    }, o.getElementsByTagName("head").item(0).appendChild(n)
                },
                getCookie: function(e, t) {
                    for (var n = e + "=", r = o.cookie.split(";"), s = 0; s < r.length; s++) {
                        var a = r[s].trim();
                        0 === a.indexOf(n) && t(a.substring(n.length, a.length))
                    }
                }
            }, a.network = a.ZSNetwork, a.gscomponent = a.gscomponent || {}, a.GSConstant = a.GSConstant || {}, a.GSConstant.supportedZSLanguages = a.GSConstant.supportedZSLanguages || ["en", "ja", "zh", "baihui_en", "baihui_zh", "sd_IN", "fa_IR", "et_EE", "gu_IN", "ur_PK", "ko_KR", "km_KH", "ta_IN", "as_IN", "hi_IN", "el_GR", "fil-PH", "tr_TR", "sl_SI", "ja_JP", "az_Latn-AZ", "it_IT", "es_ES", "pa_IN", "lo_LA", "bg_BG", "da_DK", "ms_MY", "cs_CZ", "nb_NO", "bn_IN", "de_DE", "lt_LT", "nl_NL", "ca_ES", "mr_IN", "zh_CN", "sq_AL", "si_LK", "my_MM", "th_TH", "uk_UA", "he_IL", "sv_SE", "sr_Latn-RS", "hr_HR", "fi_FI", "pt_PT", "hu_HU", "eu_ES", "ro_RO", "lv_LV", "pt_BR", "ne_NP", "ar_EG", "mk_MK", "vi_VN", "kn_IN", "fr_FR", "jv", "te_IN", "ru_RU", "pl_PL", "ks_IN", "mai_IN", "ml_IN", "or_IN", "sat_IN", "brx_IN", "doi_IN", "kok_IN", "sd_IN", "mni_IN", "sa_IN"], a.GSConstant.rtlSupportedZSLanguages = a.GSConstant.rtlSupportedZSLanguages || ["ar_EG", "ur_PK", "fa_IR", "he_IL", "ks_IN"], a.getbd = "/zgssearch/getbd", a.isExtension = !1, a.thirdPartyCookieDisabled = !1, a.GSConstant.languageVsCountryObj = {
                ar: ["ar_EG"],
                as: ["as_IN"],
                az: ["az_Latn-AZ"],
                bg: ["bg_BG"],
                bn: ["bn_IN"],
                cs: ["cs_CZ"],
                da: ["da_DK"],
                de: ["de_DE"],
                el: ["el_GR"],
                es: ["es_ES"],
                fi: ["fi_FI"],
                fr: ["fr_FR"],
                gu: ["gu_IN"],
                hi: ["hi_IN"],
                hr: ["hr_HR"],
                hu: ["hu_HU"],
                it: ["it_IT"],
                ja: ["ja_JP"],
                kn: ["kn_IN"],
                ko: ["ko_KR"],
                lt: ["lt_LT"],
                mr: ["mr_IN"],
                ms: ["ms_MY"],
                nb: ["nb_NO"],
                ne: ["ne_NP"],
                nl: ["nl_NL"],
                pa: ["pa_IN"],
                pl: ["pl_PL"],
                pt: ["pt_PT", "pt_BR"],
                ro: ["ro_RO"],
                ru: ["ru_RU"],
                sl: ["sl_SI"],
                sr: ["sr_Latn-RS"],
                sv: ["sv_SE"],
                ta: ["ta_IN"],
                te: ["te_IN"],
                th: ["th_TH"],
                tr: ["tr_TR"],
                uk: ["uk_UA"],
                ur: ["ur_PK"],
                vi: ["vi_VN"],
                zh: ["zh_CN"],
                ca: ["ca_ES"],
                et: ["et_EE"],
                eu: ["eu_ES"],
                fa: ["fa_IR"],
                he: ["he_IL"],
                jv: ["jv"],
                km: ["km_KH"],
                lo: ["lo_LA"],
                lv: ["lv_LV"],
                mk: ["mk_MK"],
                ph: ["fil-PH"],
                si: ["si_LK"],
                sq: ["sq_AL"],
                my: ["my_MM"],
                in: ["id_ID"],
                ks: ["ks_IN"],
                mai: ["mai_IN"],
                ml: ["ml_IN"],
                or: ["or_IN"],
                sat: ["sat_IN"],
                brx: ["brx_IN"],
                doi: ["doi_IN"],
                kok: ["kok_IN"],
                sd: ["sd_IN"],
                mni: ["mni_IN"],
                sa: ["sa_IN"]
            }, a.console = s.console;
            var n = a.console;
            return a.throwClientError = function(e, t) {
                n.log("ZS: " + (e = t ? e + " " + t : e)), "undefined" != typeof murphy && murphy.error(t)
            }, a.logTrace = function(e) {
                n.log(e)
            }, a.includes = function(e, t) {
                return String.prototype.includes ? t.includes(e) : -1 !== t.indexOf(e)
            }, a.assignObject = function(e, t) {
                return "function" != typeof Object.assign && (Object.assign = function(e) {
                    "use strict";
                    null == e && a.throwClientError("Cannot convert undefined or null to object"), e = Object(e);
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        if (null != n)
                            for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
                    }
                    return e
                }), Object.assign(e, t)
            }, a.initLoadZSFiles = function(e) {
                a.gsbuildDetails = a.jsonParse(e), a.loadZSFiles()
            }, a.initZGSHandler = function(e) {
                var r;
                !!s.hasOwnProperty("ZSLite") && s.ZSLite ? s.ZSLite && (s.hasOwnProperty("openZiaAPIHandler") || s.hasOwnProperty("openZSHandler")) && (r = s.hasOwnProperty("openZiaAPIHandler") ? "openZiaAPIHandler" : "openZSHandler", a.serviceSearch = function(e, t, n) {
                    s.hasOwnProperty("openZiaAPIHandler") ? s[r]("zgssearch.serviceSearch", [e, t, n]) : s[r]([e, t, n])
                }, a.helpSearch = function(e, t, n) {
                    s.hasOwnProperty("openZiaAPIHandler") ? s[r]("zgssearch.helpSearch", [e, t, n]) : s[r]([e, t, n])
                }, a.open = function() {
                    s.hasOwnProperty("openZiaAPIHandler") ? s[r]("zgssearch.open") : s[r]()
                }, a.search = function(e) {
                    s.hasOwnProperty("openZiaAPIHandler") ? s[r]("zgssearch.search", [e]) : s[r]([e])
                }, a.advancedSearch = function(e) {
                    s.hasOwnProperty("openZiaAPIHandler") ? s[r]("zgssearch.advancedSearch", [e]) : s[r]([e])
                }) : ((e = e || {}) && (null != e.thirdPartyCookieDisabled && (a.thirdPartyCookieDisabled = e.thirdPartyCookieDisabled), e.network && (a.network = e.network), e.source && "extension" === e.source && (a.isExtension = !0)), (e = a.assignObject(e, a.gsbuildDetails)).gsrebrand = e.hasOwnProperty("gsrebrand") ? e.gsrebrand : "undefined" != typeof WebMessanger && WebMessanger.rebrand || "", e.gslanguage = e.hasOwnProperty("gslanguage") ? e.gslanguage : "undefined" != typeof WebMessanger && WebMessanger.language || "", e.gscountry = e.hasOwnProperty("gscountry") ? e.gscountry : "undefined" != typeof WebMessanger && WebMessanger.countrycode || "", a.gscomponent = a.assignObject(a.gscomponent, e), e.hasOwnProperty("getbdDataObtained") || e.hasOwnProperty("isFingerprintEnabled") ? a.initLoadZSFiles(e) : a.getBuildDetails())
            }, a.jsonParse = function(e) {
                try {
                    if ("string" == typeof e) return JSON.parse(e)
                } catch (e) {
                    a.throwClientError("Error while parsing json data", e)
                }
                return e
            }, a.abortXMLHTTPReq = function(e) {
                e && e.abort()
            }, a.getRequestObject = function() {
                try {
                    return new XMLHttpRequest
                } catch (e) {
                    throw a.throwClientError("Unable to create XML Http Object for Ajax Request.", e), e
                }
            }, a.getBuildDetails = function() {
                a.network.xmlHttpReq("GET", a.getbd, !0, function(e) {
                    e && e.status && "error" != e.status && (a.initLoadZSFiles(e.response), a.bdLoaded = !0)
                })
            }, a.setGSConstantObj = function(e) {
                for (var t in e) a.GSConstant[t] = e[t]
            }, a.checkAndloadFontAndJqueryFile = function() {
                var e = a.getCurrentLanguage();
                "mni_IN" === e && (a.isLinux || a.isWindows) || "sat_IN" === e && a.isLinux ? a.network.loadSRICSSFile("css/" + ("mni_IN" === e ? "manipurifont" : "santhalifont") + ".css", a.loadJQueryFile) : a.loadJQueryFile()
            }, a.loadGSFile = function() {
                a.cssLoaded ? a.checkAndloadFontAndJqueryFile() : a.network.loadSRICSSFile(a.GSConstant.resultNewCSSURL, a.checkAndloadFontAndJqueryFile)
            }, a.loadJQueryFile = function() {
                var e = !!s.hasOwnProperty("ZSJqueryCoreObj") && "3.6.0" === s.ZSJqueryCoreObj.version;
                "undefined" != typeof jQuery && "3.6.0" === jQuery().jquery || e ? (s._jQueryGS = e ? s.ZSJqueryCoreObj.scope : jQuery, s.jQuery = void 0 === s.jQuery ? jQuery : s.jQuery, a.loadI18NJSFile(!0)) : a.network.loadSRIJSFile(a.GSConstant.gsjQueryURL, a.loadI18NJSFile)
            }, a.loadI18NJSFile = function(e) {
                e || (e = jQuery, s._jQueryGS = e.noConflict(!0), s.jQuery = void 0 === s.jQuery ? e : s.jQuery, s.ZSJqueryCoreObj = {
                    scope: s._jQueryGS,
                    version: "3.6.0"
                }), a.network.loadSRIJSFile(a.GSConstant.gsi18NJSURL, a.loadResultJsFiles)
            }, a.loadResultJsFiles = function() {
                a.network.loadSRIJSFile(a.GSConstant.resultNewJSURL)
            }, a.isArrayContain = function(e, t) {
                return -1 !== _jQueryGS.inArray(e, t)
            }, a.getCurrentLanguage = function() {
                var t = a.gscomponent.gslanguage || "en",
                    n = a.gscomponent.gscountry || "",
                    e = "baihui" == (e = a.gscomponent.gsrebrand) ? e : "";
                if (-1 === a.GSConstant.supportedZSLanguages.indexOf(t))
                    if (a.GSConstant.languageVsCountryObj.hasOwnProperty(t)) {
                        var r = a.GSConstant.languageVsCountryObj[t];
                        if (1 < r.length)
                            if ("" != n) {
                                let e = "" !== n ? t + "_" + n : t;
                                for (var s = 0; s < r.length; s++) r[s].toLowerCase() === e.toLowerCase() && (e = r[s]);
                                t = "" != e ? e : "en"
                            } else t = r[0];
                        else t = r[0]
                    } else t = "en";
                return (e ? e + "_" : "") + t
            }, a.getLanguageFileName = function() {
                return "js/" + a.getCurrentLanguage() + ".js"
            }, a.loadZSFiles = function() {
                var e = a.gsbuildDetails || {};
                e.BUILD_DATE && (e.gslanguage = e.gslanguage || a.gscomponent.gslanguage, e.gscountry = e.gscountry || a.gscomponent.gscountry, e.gsserver = e.gsserver || "zohosearch", a.gscomponent = Object.assign(a.gscomponent, e), a.GSConstant.BUILD_DATE = a.gscomponent.BUILD_DATE, a.GSConstant.STATIC_RESOURCE_SERVER = a.gscomponent.STATIC_RESOURCE_SERVER, e.gsjQueryURL = "js/jquery-3.6.0.min.js", e.gsi18NJSURL = a.getLanguageFileName(), 1 === a.gscomponent.UIType ? (e.resultNewJSURL = "js/zsresult.js", e.resultNewCSSURL = "css/zsresult.css", a.loadMurphyFile()) : (e.resultNewJSURL = "js/gsresult.js", e.resultNewCSSURL = a.isExtension ? "css/extresult.css" : "css/gsresult.css"), a.setGSConstantObj(e), a.loadGSFile())
            }, a.loadWMSFiles = function() {
                a.network.loadSRICSSFile(wms_css_url, a.loadWMSJSFile)
            }, a.loadWMSJSFile = function() {
                a.network.loadSRIJSFile(wms_js_url, a.registerWMS)
            }, a.registerWMS = function() {
                var t = (new Date).getTime(),
                    n = setInterval(function() {
                        var e;
                        6e4 < (new Date).getTime() - t ? clearInterval(n) : "undefined" != typeof WebMessanger && (clearInterval(n), WebMessanger.setClientSRIValues(wms_all_sri_values), WebMessanger.setNoDomainChange(), rebrandName && null !== rebrandName && "null" !== rebrandName && (WebMessanger.setRebrand(rebrandName), WebMessanger.setIamServer(iamServer), WebMessanger.setChatServer(chat_server_url), WebMessanger.setPhotoServer(contacts_server_url), WebMessanger.setMeetingUrl(meeting_server_url)), WebMessanger.setLocale(user_info.language, user_info.country), e = WMSSessionConfig.CHAT | WMSSessionConfig.CHAT_PRESENCE | WMSSessionConfig.PRESENCE_PERSONAL | WMSSessionConfig.CROSS_PRD | WMSSessionConfig.MP, WebMessanger.setConfig(e), "rtl" === getComputedStyle(o.body).direction && WebMessanger.enableRTLMode(), WebMessanger.registerZuid("SE", user_info.zuid, user_info.primary_email, a.isWMSSilentMode))
                    }, 200)
            }, a.loadMurphyFile = function() {
                if ("undefined" == typeof murphy || !murphy.hasOwnProperty("isMurphyInstalled") || !murphy.isMurphyInstalled()) {
                    let e = a.gsbuildDetails.MURPHY_APP_KEY,
                        t = a.gsbuildDetails.MURPHY_APP_DOMAIN,
                        n = a.gsbuildDetails.MURPHY_AUTH_KEY;
                    var r;
                    e && t && n && (r = a.network.getFingerPrintFilePath("js/murphy.min.js", !0), a.network.loadJSFile(r, function() {
                        murphy.install({
                            config: {
                                appKey: e,
                                appDomain: t,
                                environment: "production",
                                authKey: n,
                                enableTracking: !1,
                                rageRequest: {
                                    timeInterval: "5000",
                                    tokenLimit: "3",
                                    apiBasePath: "",
                                    enable: !0
                                }
                            },
                            setTags: function() {
                                return {
                                    buildId: a.GSConstant.BUILD_DATE
                                }
                            }
                        })
                    }))
                }
            }, a
        }(void 0);
    s.zgssearch = e
}(window);