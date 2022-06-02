import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { ApiServiceService } from "src/app/Services/api-service.service"
import { tap } from 'rxjs/operators'
import { getCartDataAction} from "../actions/Cart.action";

export class FetchCartStateModel {
    cartData: any;
    cartDataLoaded!: boolean
}

@State<FetchCartStateModel>({
    name: 'fetchCartData',
    defaults: {
        cartData: [],
        cartDataLoaded: false
    }
})

@Injectable()
export class FetchedCartDataState {
    //selector has logic
    constructor(private _ApiData: ApiServiceService) { }

    @Selector()
    static getFetchedCartData(state: FetchCartStateModel) {
        return state.cartData;
    }

    @Selector()
    static getFetchedCartDataLoaded(state:FetchCartStateModel){
        return state.cartDataLoaded;
    }

    @Action(getCartDataAction)
        getfetchedcategories({ getState, setState }: StateContext<FetchCartStateModel>) {
            return this._ApiData.getItemFromState().pipe(tap(res => {
                const state = getState();
                setState({
                    ...state,
                    cartData: res,
                    cartDataLoaded: true
                });
            }))
        }
}
