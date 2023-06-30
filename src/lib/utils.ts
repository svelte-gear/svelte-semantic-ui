type SemanticApi = {
    dropdown(options?: unknown, value?: unknown): void;
};

type JQueryHolder = {
    jquery(selector: unknown): SemanticApi;
};

type ActionFn = (text: string, value: string | number) => void;

export function dropdown(selector: unknown, action?: ActionFn): void {
    const elem = (window as unknown as JQueryHolder).jquery(selector);
    function myAction(text: string, value: string | number): void {
        if (action) {
            action(text, value);
        }
        elem.dropdown("set selected", text);
        elem.dropdown("hide");
    }
    if (action) {
        elem.dropdown({
            action: myAction,
        });
    } else {
        elem.dropdown({
            action: action,
        });
    }
}

export function dropdownFullSearch(selector: unknown): void {
    (window as unknown as JQueryHolder).jquery(selector).dropdown({
        fullTextSearch: true,
    });
}
