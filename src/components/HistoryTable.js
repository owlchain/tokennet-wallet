import React, { Component } from 'react';
import T from 'i18n-react';
import './HistoryTable.scss';
import { connect } from "react-redux";
import moment from 'moment';
import AmountSpan from "./AmountSpan";
import trimZero from "../utils/trimZero";

class HistoryTable extends Component {
	RENDER_ITEM_PER = 5;

	constructor() {
		super();

		const state = {
			historyPage: 0,
		};

		this.state = state;
	}

	readMore = () => {
		this.setState( {
			historyPage: this.state.historyPage + 1
		} );
	};

	shortAddress( $address, $length = 6 ) {
		return $address.substr( 0, $length ) + '...' + $address.substr( $length * -1 );
	}

	renderHistory = () => {
		const history = [];
		let data = this.props.paymentHistory;
		let length = data.length;

		if ( (this.state.historyPage + 1) * this.RENDER_ITEM_PER < length ) {
			length = (this.state.historyPage + 1) * this.RENDER_ITEM_PER;
		}

		for ( let i = 0; i < length; i++ ) {
			const payment = data[ i ];
			const me = this.props.keypair.publicKey();
			let amount = 0;
			let label = '';
			let target = '';
			let date = moment( payment.transaction.created_at ).format( 'YYYY.MM.DD HH:mm' );
			switch ( payment.type ) {
				case 'create_account' :
					const funder = payment.funder;
					if ( funder === me ) {
						label = 'wallet_view.sent';
						target = payment.account;
					}
					else {
						label = 'wallet_view.created_account';
						if( payment.transaction && payment.transaction.source_account ) {
							target = payment.transaction.source_account;
						}
						else {
							target = '-';
						}
					}
					amount = payment.starting_balance;
					break;
				case 'payment' :
					if ( payment.asset_type !== 'native' )
						continue;
					const from = payment.from;
					if ( me === from ) {
						label = 'wallet_view.sent';
						target = payment.to;
					}
					else {
						label = 'wallet_view.received';
						target = payment.from;
					}
					amount = data[ i ].amount;
					break;
				default :
					break;
			}
			if ( label !== '' ) {
				const DOM = <div className="h-group" key={data[ i ].id}>
					<div className="col label"><T.span text={label}/></div>
					<div className="col target">{target}</div>
					<div className="col amount">
						<AmountSpan value={ trimZero( amount ) }/>
					</div>
					<div className="col date">{date}</div>
				</div>;
				history.push( DOM );
			}
		}

		return history;
	};

	render() {
		const hasMore = (this.state.historyPage + 1) * this.RENDER_ITEM_PER < this.props.paymentHistory.length;
		return (
			<div className="history-table-container" data-lang={this.props.language}>
				<div data-length={this.props.paymentHistory.length}>
					{this.renderHistory()}
				</div>
				<p className={"more-wrapper " +
				( hasMore ? 'is-more' : '')
				}>
					{ hasMore &&
					<span onClick={this.readMore}>more </span>
					}
				</p>
			</div>
		)
	}
}

const mapStoreToProps = ( store ) => ( {
	keypair: store.keypair.keypair,
	paymentHistory: store.stream.paymentHistory,
	language: store.language.language,
} );

HistoryTable = connect( mapStoreToProps )( HistoryTable );

export default HistoryTable;