import { Component } from '@angular/core';
import {Categories} from '../fundraising-campaigns/categories/categories';
import {ListFundraisingCampaigns} from './list-fundraising-campaigns/list-fundraising-campaigns';

@Component({
  selector: 'app-fundraising-campaigns',
  imports: [ Categories, ListFundraisingCampaigns ],
  templateUrl: './fundraising-campaigns.html',
  styleUrl: './fundraising-campaigns.scss',
})
export class FundraisingCampaigns {}
