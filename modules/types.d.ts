export interface callbackMap{
    item: string;
    callback: (any);
}

 declare namespace item_menu{
    export interface AddItemMenuInterface {
        (s: string, options: string[], handlers: callbackMap[]) : any;
        (): any;
    }
}

interface JQuery {
     addItemMenu: item_menu.AddItemMenuInterface;
     sort(a: any) : any;
 }


