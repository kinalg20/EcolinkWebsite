import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { ApiServiceService } from "src/app/Services/api-service.service"
import { tap } from 'rxjs/operators'
import { addCartDataAction } from "../actions/addItemCart.action";

export class AddCartStateModel {
    cartData: any;
    cartDataLoaded!: boolean
}

@State<AddCartStateModel>({
    name: 'fetchCartData',
    defaults: {
        cartData: [],
        cartDataLoaded: false
    }
})

@Injectable()
export class AddCartDataState {
    //selector has logic
    constructor(private _ApiData: ApiServiceService) { }

    @Selector()
    static getCartAddedData(state: AddCartStateModel) {
        return state.cartData;
    }

    @Selector()
    static getCartAddedDataLoaded(state: AddCartStateModel) {
        return state.cartDataLoaded;
    }

    @Action(addCartDataAction)
    getResponseByCart({ getState, setState }: StateContext<AddCartStateModel>, product_detail: addCartDataAction) {
        console.log(product_detail);
        return this._ApiData.addItemToState(product_detail).pipe(tap(res => {
            const state = getState();
            setState({
                ...state,
                cartData: res,
                cartDataLoaded: true
            });
        }))
    }
}
