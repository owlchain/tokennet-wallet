import React, { Component } from 'react';
import './MyBalance.scss';
import { connect } from 'react-redux';
import AmountSpan from "./AmountSpan";
import trimZero from "../utils/trimZero";

class MyBalance extends Component {
	render() {
		let balance = 0;
		if ( this.props.account ) {
            balance = this.props.account.balances.find( function(asset) {
                return asset.asset_type === "native";
            }).balance;
		}

		return (
			<div className="balance-container">
				<p id="balance">
					<AmountSpan value={ trimZero( balance ) }/>
					{ ' ' }
					<span className={ 'unit' }>BOS</span>
				</p>
			</div>
		)
	}
}

const mapStoreToProps = ( store ) => ( {
	account: store.stream.account,
	language: store.language.language,
} );

MyBalance = connect( mapStoreToProps )( MyBalance );

export default MyBalance
