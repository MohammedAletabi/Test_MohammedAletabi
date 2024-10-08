(function() {
    var t;
    var e;
    var n;
    var o = [];
    var i = [];
    var r = false;
    var a = "jetpack:wpcomRLT";

    function c(t) {
        if (!Array.isArray(n)) {
            return false
        }
        return n.includes(t)
    }

    function s(t, e, n) {
        if (e && typeof e.postMessage === "function") {
            try {
                e.postMessage(JSON.stringify({
                    type: "rltMessage",
                    data: {
                        event: "invalidate",
                        token: t,
                        sourceOrigin: window.location.origin
                    }
                }), n)
            } catch (t) {
                return
            }
        }
    }
    window.rltInvalidateToken = function(n, i) {
        if (n === t) {
            t = null
        }
        try {
            if (window.location === window.parent.location && window.localStorage) {
                if (window.localStorage.getItem(a) === n) {
                    window.localStorage.removeItem(a)
                }
            }
        } catch (t) {
            console.info("localstorage access for invalidate denied - probably blocked third-party access", window.location.href)
        }
        for (const [t, e] of o) {
            if (t !== i) {
                s(n, e, t)
            }
        }
        if (e && e !== i && window.parent) {
            s(n, window.parent, e)
        }
    };
    window.rltInjectToken = function(t, e, n) {
        if (e && typeof e.postMessage === "function") {
            try {
                e.postMessage(JSON.stringify({
                    type: "loginMessage",
                    data: {
                        event: "login",
                        success: true,
                        type: "rlt",
                        token: t,
                        sourceOrigin: window.location.origin
                    }
                }), n)
            } catch (t) {
                return
            }
        }
    };
    window.rltIsAuthenticated = function() {
        return !!t
    };
    window.rltGetToken = function() {
        return t
    };
    window.rltAddInitializationListener = function(e) {
        if (r) {
            e(t)
        } else {
            i.push(e)
        }
    };
    window.rltStoreToken = function(e) {
        t = e;
        try {
            if (window.location === window.parent.location && window.localStorage) {
                window.localStorage.setItem(a, e)
            }
        } catch (t) {
            console.info("localstorage access denied - probably blocked third-party access", window.location.href)
        }
    };
    window.rltInitialize = function(s) {
        if (!s || typeof window.postMessage !== "function") {
            return
        }
        t = s.token;
        n = s.iframeOrigins;
        e = s.parentOrigin;
        try {
            if (!t && window.location === window.parent.location && window.localStorage) {
                t = window.localStorage.getItem(a)
            }
        } catch (t) {
            console.info("localstorage access denied - probably blocked third-party access", window.location.href)
        }
        window.addEventListener("message", function(n) {
            var i = n && n.data;
            if (typeof i === "string") {
                try {
                    i = JSON.parse(i)
                } catch (t) {
                    return
                }
            }
            var r = i && i.type;
            var a = i && i.data;
            if (r === "loginMessage") {
                if (a && a.type === "rlt" && a.token !== t) {
                    rltStoreToken(a.token);
                    for (const [e, n] of o) {
                        rltInjectToken(t, n, e)
                    }
                    if (e && e !== a.sourceOrigin && window.parent) {
                        rltInjectToken(t, window.parent, e)
                    }
                }
            }
            if (r === "rltMessage") {
                if (a && a.event === "invalidate" && a.token === t) {
                    rltInvalidateToken(a.token)
                }
                if (a && a.event === "register") {
                    if (c(n.origin)) {
                        o.push([n.origin, n.source]);
                        if (t) {
                            rltInjectToken(t, n.source, n.origin)
                        }
                    }
                }
            }
        });
        i.forEach(function(e) {
            e(t)
        });
        i = [];
        window.parent.postMessage({
            type: "rltMessage",
            data: {
                event: "register"
            }
        }, "*");
        r = true
    }
})();