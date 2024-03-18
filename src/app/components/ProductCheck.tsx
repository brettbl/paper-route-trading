import React, { useContext, ComponentType, FC } from 'react';
import { ProductContext } from './AppContext'; // Import your context
import './Components.css';

interface ProductContextType {
    product: string | null;
    response: string | null;
}

function withProductCheck(WrappedComponent: ComponentType<any>): FC {
    return function WithProductCheck(props: any) {
        const { product, response } = useContext<ProductContextType>(ProductContext as React.Context<ProductContextType>);
        // If product is available but response is 'Fail', return an error message
        if (response === 'Fail') {
            return (
                <div className='Loading'>
                    <span className='Alert-Error'>Read Error</span>
                    <span>Unable to read tag ID. Please tap the chip again.</span>
                </div>
            );
        }

        // If product and response are both available and response is not 'Fail', render the WrappedComponent
        return <WrappedComponent {...props} />;
    };
}

export default withProductCheck;