<template>
  <v-card color="secondary" flat tile>
    <component :is="sampleCommentsComponent" :data="customer" />
    <component :is="customerBookComponent" :data="customer" :showAddItemBtn="false"/>
    <component :is="printInvoiceComponent" :data="printData" />

    <v-card-title>
      Invoice #{{invoiceNo}}
      <v-chip label small color="black" outlined class="ml-2">
        <span v-if="isSameStateInvoice">CGST/SGST</span>
        <span v-else>IGST</span>
      </v-chip>
      <v-chip label small color="black" outlined class="ml-2">
        {{invoiceStatus}}
      </v-chip>
      <v-chip label small color="black" outlined class="ml-2">
        {{invoiceFinancialYear}}
      </v-chip>
      <v-chip label small color="black" outlined class="ml-2">
        {{companyDetails.name}}, {{companyDetails.state_name}}
      </v-chip>
      <v-chip label small color="black" outlined class="ml-2">
        {{customer.name}}, {{customer.state_name}}
      </v-chip>

      <v-spacer></v-spacer>

      <v-menu open-on-hover left bottom origin="center center" transition="scale-transition">
        <template v-slot:activator="{ on }">
          <v-icon v-on="on">mdi-dots-vertical</v-icon>
        </template>

        <v-list light>
          <v-list-item @click="printInvoice">
            <v-list-item-title>Print</v-list-item-title>
          </v-list-item>

          <v-list-item @click="saveInvoice" v-if="userDetails().permissions.invoice.edit">
            <v-list-item-content>
              <v-list-item-title>Save</v-list-item-title>
              <v-list-item-subtitle class="font-weight-bold red--text" v-if="!editInvoiceFormValid">
                <small>price/packaging/quantity/HSN missing</small>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="openSampleCommentsDialog">
            <v-list-item-title>Sample comments</v-list-item-title>
          </v-list-item>

          <v-list-item @click="openCustomerBookDialog">
            <v-list-item-title>Customer book</v-list-item-title>
          </v-list-item>

          <v-list-item @click="deleteInvoice" v-if="userDetails().permissions.invoice.delete">
            <v-list-item-title>Delete invoice</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-card-text>
      <v-tabs fixed-tabs>
        <v-tabs-slider color="primary"></v-tabs-slider>

        <v-tab href="#companyAndInvoice">Company & invoice</v-tab>
        <v-tab href="#consigneeAndDelivery">Consignee & delivery</v-tab>
        <v-tab href="#aadharAndPackage">Aadhar, bank & package</v-tab>
        <v-tab href="#itemAndHSN">Item & HSN</v-tab>

        <v-tab-item value="companyAndInvoice">

          <v-card flat>
            <v-layout row wrap>

              <v-flex xs12 sm6 md6 lg6>
                <v-toolbar color="secondary" dense flat>
                  <v-toolbar-title>
                    Company details
                  </v-toolbar-title>
                </v-toolbar>

                <v-container grid-list-md>
                  <v-layout wrap class="pa-2">

                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Company name" clearable v-model="companyDetails.name">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Company st address" clearable
                                    v-model="companyDetails.st_address">
                      </v-text-field>
                    </v-flex>

                    <v-flex xs12 sm4 md4>
                      <v-text-field label="Company city" clearable v-model="companyDetails.city">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field label="Company state" clearable
                                    v-model="companyDetails.state_name">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field label="Company postcode" clearable
                                    v-model="companyDetails.postcode">
                      </v-text-field>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Company phone no" clearable
                                    v-model="companyDetails.phone_no">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Company email" clearable
                                    v-model="companyDetails.contact_email">
                      </v-text-field>
                    </v-flex>

                    <v-flex xs12 sm4 md4>
                      <v-text-field label="Company GSTIN/UIN" clearable
                                    v-model="companyDetails.gstin_no">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field label="Company PAN" clearable v-model="companyDetails.pan_no">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field label="Company code" clearable v-model="companyDetails.code">
                      </v-text-field>
                    </v-flex>

                  </v-layout>
                </v-container>
              </v-flex>

              <v-flex xs12 sm6 md6 lg6>
                <v-toolbar color="secondary" dense flat>
                  <v-toolbar-title>
                    Invoice details
                  </v-toolbar-title>
                </v-toolbar>

                <v-container grid-list-md>
                  <v-layout wrap class="pa-2">

                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Brand name" clearable v-model="brandName">
                      </v-text-field>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Goods description" clearable v-model="goodsDescription">
                      </v-text-field>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Invoice no" disabled v-model="invoiceNo">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-menu v-model="invoiceDateMenu" :close-on-content-click="false"
                              :nudge-right="40" transition="scale-transition" offset-y
                              min-width="290px">
                        <template v-slot:activator="{ on }">
                          <v-text-field v-model="invoiceDate" readonly v-on="on"
                                        label="Invoice date"></v-text-field>
                        </template>
                        <v-date-picker v-model="invoiceDate" scrollable first-day-of-week="1"
                                       color="primary" @input="invoiceDateMenu = false"
                                       :min="previousInvoiceDate" :max="nextInvoiceDate">
                        </v-date-picker>
                      </v-menu>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Delivery note" clearable v-model="deliveryNote">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Mode / Terms of payment" clearable
                                    v-model="termsOfPayment">
                      </v-text-field>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Suppliers ref" clearable v-model="supplierRef">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Other reference(s)" clearable v-model="otherReferences">
                      </v-text-field>
                    </v-flex>

                  </v-layout>
                </v-container>
              </v-flex>

              <v-flex xs12 sm12 md12 class="ml-3 mr-3 pa-2">
                <v-text-field label="Sample comments" clearable v-model="sampleComments">
                </v-text-field>
              </v-flex>

            </v-layout>
          </v-card>

        </v-tab-item>

        <v-tab-item value="consigneeAndDelivery">

          <v-card flat>
            <v-layout row wrap>
              <v-flex xs12 sm6 md6 lg6>
                <v-toolbar color="secondary" dense flat>
                  <v-toolbar-title>
                    Consignee details
                  </v-toolbar-title>
                </v-toolbar>

                <v-container grid-list-md>
                  <v-layout wrap class="pa-2">

                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Consignee name" clearable
                                    v-model="consigneeDetails.name">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Consignee st address" clearable
                                    v-model="consigneeDetails.st_address">
                      </v-text-field>
                    </v-flex>

                    <v-flex xs12 sm4 md4>
                      <v-text-field label="Consignee city" clearable
                                    v-model="consigneeDetails.city">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field label="Consignee state" clearable
                                    v-model="consigneeDetails.state_name">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field label="Consignee postcode" clearable
                                    v-model="consigneeDetails.postcode">
                      </v-text-field>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Consignee phone no" clearable
                                    v-model="consigneeDetails.phone_no">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Consignee email" clearable
                                    v-model="consigneeDetails.contact_email">
                      </v-text-field>
                    </v-flex>

                    <v-flex xs12 sm4 md4>
                      <v-text-field label="Consignee GSTIN/UIN" clearable
                                    v-model="consigneeDetails.gstin_no">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field label="Consignee PAN" clearable
                                    v-model="consigneeDetails.pan_no">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <v-text-field label="Consignee code" clearable
                                    v-model="consigneeDetails.code">
                      </v-text-field>
                    </v-flex>

                  </v-layout>
                </v-container>
              </v-flex>

              <v-flex xs12 sm6 md6 lg6>
                <v-toolbar color="secondary" dense flat>
                  <v-toolbar-title>
                    Delivery details
                  </v-toolbar-title>
                </v-toolbar>

                <v-container grid-list-md>
                  <v-layout wrap class="pa-2">

                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Buyers Order no" v-model="buyersOrderNo" clearable>
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-menu v-model="datedMenu" :close-on-content-click="false"
                              :nudge-right="40" transition="scale-transition" offset-y
                              min-width="290px">
                        <template v-slot:activator="{ on }">
                          <v-text-field v-model="dated" readonly v-on="on"
                                        label="Dated"></v-text-field>
                        </template>
                        <v-date-picker v-model="dated" scrollable first-day-of-week="1"
                                       color="primary" @input="datedMenu = false">
                        </v-date-picker>
                      </v-menu>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Despatch document no" clearable
                                    v-model="despatchDocumentNo">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-menu v-model="despatchDateMenu" :close-on-content-click="false"
                              :nudge-right="40" transition="scale-transition" offset-y
                              min-width="290px">
                        <template v-slot:activator="{ on }">
                          <v-text-field v-model="despatchDate" readonly v-on="on"
                                        label="Despatch date"></v-text-field>
                        </template>
                        <v-date-picker v-model="despatchDate" scrollable first-day-of-week="1"
                                       color="primary" @input="despatchDateMenu = false">
                        </v-date-picker>
                      </v-menu>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <v-combobox v-model="despatchThrough" label="Despatched through"
                                  :items="transports" item-text="name" item-value="id"
                                  hide-details return-object @input="setDespatchDetails">
                        <template slot="item" slot-scope="{ item }">
                          <v-list-item-content>
                            <v-list-item-title v-text="item.name"></v-list-item-title>
                            <v-list-item-subtitle>
                              <b>Location</b> - {{item.location}} |
                              <b>GST No</b> - {{item.gst_no}}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </v-combobox>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Destination" clearable v-model="destination">
                      </v-text-field>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Vehicle no" clearable v-model="vehicleNo">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Transport GST No" clearable v-model="despatchThroughGST">
                      </v-text-field>
                    </v-flex>

                  </v-layout>
                </v-container>
              </v-flex>
            </v-layout>
          </v-card>

        </v-tab-item>

        <v-tab-item value="aadharAndPackage">

          <v-card flat>
            <v-layout row wrap>
              <v-flex xs12 sm6 md6 lg6>

                <v-toolbar color="secondary" dense flat>
                  <v-toolbar-title>
                    Aadhar & bank details
                  </v-toolbar-title>
                </v-toolbar>

                <v-container grid-list-md>
                  <v-layout wrap class="pa-2">

                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Buyer aadhar" clearable v-model="buyerAadhar">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Bank name" clearable v-model="companyDetails.bank_name">
                      </v-text-field>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Company PAN (Same)" clearable
                                    v-model="companyDetails.pan_no">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field label="A/c no." clearable
                                    v-model="companyDetails.bank_account_no">
                      </v-text-field>
                    </v-flex>

                    <v-flex xs12 sm12 md12>
                      <v-text-field label="Branch & IFS Code" clearable
                                    v-model="companyDetails.bank_branch">
                      </v-text-field>
                    </v-flex>

                  </v-layout>
                </v-container>
              </v-flex>

              <v-flex xs12 sm6 md6 lg6>

                <v-toolbar color="secondary" dense flat>
                  <v-toolbar-title>
                    Package details
                  </v-toolbar-title>
                </v-toolbar>

                <v-container grid-list-md>
                  <v-layout wrap class="pa-2">

                    <v-flex xs12 sm6 md6>
                      <v-text-field label="P.M. no" v-model="pmNo" clearable>
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field label="No of packages" v-model="noOfPackages" clearable>
                      </v-text-field>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <v-text-field label="e-Waybill no" clearable v-model="eSugamNo">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field label="Gross weight" clearable v-model="grossWeight">
                      </v-text-field>
                    </v-flex>

                    <v-flex xs12 sm12 md12>
                      <v-text-field label="Terms of delivery" clearable v-model="termsOfDelivery">
                      </v-text-field>
                    </v-flex>

                  </v-layout>
                </v-container>
              </v-flex>
            </v-layout>
          </v-card>

        </v-tab-item>

        <v-tab-item value="itemAndHSN">

          <v-layout row wrap>
            <v-flex xs12 sm12 md12 lg12>
              <div>
                <v-toolbar color="secondary" dense flat>
                  <v-toolbar-title>
                    Item details
                  </v-toolbar-title>

                  <v-spacer></v-spacer>

                  <v-btn icon color="primary" @click="itemArray.push({})">
                    <v-icon size="30">mdi-plus-circle</v-icon>
                  </v-btn>
                </v-toolbar>

                <v-fab-transition>
                  <v-speed-dial v-scroll="onScroll" v-show="fab" bottom right fixed direction="top"
                                open-on-hover style="bottom: 70px">
                    <template v-slot:activator>
                      <v-btn v-model="fab" color="primary" fab>
                        <v-icon v-if="fab">mdi-dots-vertical</v-icon>
                        <v-icon v-else>mdi-close</v-icon>
                      </v-btn>
                    </template>

                    <v-btn fab color="primary" small @click="itemArray.push({})">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>

                    <v-btn fab color="primary" small @click="printInvoice">
                      <v-icon>mdi-printer</v-icon>
                    </v-btn>
                  </v-speed-dial>
                </v-fab-transition>

                <v-form v-model="editInvoiceFormValid" lazy-validation>
                  <v-simple-table :headers="headers" :items="itemArray" class="ma-4">
                    <thead>
                      <tr>
                        <th v-for="header in headers" :key="header.value"
                            :class="header.value !== 'item_amount'? 'text-left': 'text-right'"
                            v-bind:style="header.value === 'item_amount'? { width: header.width } : ''">
                          {{header.text}}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <!-- Items row -->
                      <tr v-for="(item, index) in itemArray" :key="index">
                        <td style="position: relative">
                          <v-text-field v-model="item.item_name" hide-details @input="itemTyped(item)"
                                        @focusin="showSearchCard(item, index)"
                                        @click="showSearchCard(item, index)"
                                        :loading="item.isItemsLoading">
                          </v-text-field>

                          <v-combobox v-model="item.subitems" placeholder="item tags ..."
                                      item-text="subitems"
                                      multiple small-chips dense deletable-chips return-object
                                      hide-details @input="formatSubItems(item)">
                          </v-combobox>

                          <!-- Show items list & recently ordered items -->
                          <v-card class="item-search-card overflow-auto" tile width="600" max-width="600"
                                  color="secondary" v-if="item.showSearchCard" max-height="300"
                                  :id="'search-card-' + index">
                            <v-card-text class="pa-0">
                              <v-row no-gutters>

                                <!-- Items from item list API -->
                                <v-col cols="12" md="5" class="px-1">
                                  <h2 class="py-2 text-center">Stored items</h2>
                                  <v-list dense v-if="item.returned_items.length > 0" tile>
                                    <v-list-item v-for="(val, key) in item.returned_items" :key="key">
                                      <v-list-item-avatar color="primary"
                                                          class="headline font-weight-light white--text">
                                        {{ val.name.charAt(0) }}
                                      </v-list-item-avatar>
                                      <v-list-item-content
                                        @click="setItemNameObjectAndInitPriceList(item, val, index)">
                                        <v-list-item-title v-text="val.name"></v-list-item-title>
                                        <v-list-item-subtitle
                                          v-text="'Series - ' + val.series"></v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-list-item>
                                  </v-list>
                                </v-col>
                                <!-- Items from item list API -->

                                <!-- Items from recently ordered items API -->
                                <v-col cols="12" md="7" class="px-1">
                                  <h2 class="py-2 text-center">Ordered items</h2>
                                  <p class="py-2 text-center" v-if="!item.wasItemPreviouslyOrdered">
                                    No previously ordered items found
                                  </p>
                                  <v-list dense v-if="item.previousOrderDetails.length > 0" tile>
                                    <v-list-item v-for="(val, key) in item.previousOrderDetails" :key="key">
                                      <v-list-item-avatar color="primary"
                                                          class="headline font-weight-light white--text">
                                        {{ val.item_name.charAt(0) }}
                                      </v-list-item-avatar>
                                      <v-list-item-content>
                                        <v-list-item-title v-text="val.item_name"></v-list-item-title>
                                        <v-list-item-subtitle
                                          v-text="'Price - ₹ ' + val.item_price">
                                        </v-list-item-subtitle>
                                        <v-list-item-subtitle
                                          v-text="'Price/kg - ₹ ' + val.price_per_kg">
                                        </v-list-item-subtitle>
                                        <v-list-item-subtitle v-if="val.units_for_display === 'kg'">
                                          Packaging -
                                          {{parseFloat(val.packaging)}}
                                          {{parseFloat(val.packaging) < 1000.0 ? 'gm' : 'kg'}}
                                        </v-list-item-subtitle>
                                      </v-list-item-content>

                                      <v-list-item-action class="my-0 py-2">
                                        <v-list-item-action-text class="font-weight-bold">
                                          Qty : {{ val.no_of_items }}
                                        </v-list-item-action-text>
                                        <v-list-item-action-text class="font-weight-bold">
                                          {{ calendarDate(val.order_date) }}
                                        </v-list-item-action-text>
                                        <v-list-item-action-text
                                          class="font-weight-bold"
                                          v-if="val.units_for_display === 'kg'">
                                          <a style="text-decoration: underline"
                                             @click="addOrderedItemToInvoice(val, index)">
                                            Add to invoice
                                          </a>
                                        </v-list-item-action-text>
                                      </v-list-item-action>
                                    </v-list-item>
                                  </v-list>
                                </v-col>
                                <!-- Items from recently ordered items API -->
                              </v-row>
                            </v-card-text>
                          </v-card>

<!--                          <v-combobox v-model="item.item_name" :items="perfumesAfterFormatting"-->
<!--                                      hide-details item-text="name" return-object item-value="id"-->
<!--                                      :rules="[rules.required]"-->
<!--                                      @input="setItemNameObjectAndInitPriceList(item)">-->
<!--                            <template slot="item" slot-scope="{ item }">-->
<!--                              <v-list-item-avatar color="primary"-->
<!--                                                  class="headline font-weight-light white&#45;&#45;text">-->
<!--                                {{ item.name.charAt(0) }}-->
<!--                              </v-list-item-avatar>-->
<!--                              <v-list-item-content>-->
<!--                                <v-list-item-title v-text="item.name"></v-list-item-title>-->
<!--                                <v-list-item-subtitle-->
<!--                                  v-text="'Series - ' + item.series"></v-list-item-subtitle>-->
<!--                              </v-list-item-content>-->
<!--                            </template>-->
<!--                            <template slot="prepend" v-if="item.wasItemPreviouslyOrdered">-->
<!--                              <v-menu v-if="item.previousOrderDetails.length > 0"-->
<!--                                      :close-on-content-click="false">-->
<!--                                <template v-slot:activator="{ on }">-->
<!--                                  <v-btn v-on="on" icon small color="primary">-->
<!--                                    <v-icon size="20">mdi-emoticon-outline</v-icon>-->
<!--                                  </v-btn>-->
<!--                                </template>-->

<!--                                &lt;!&ndash; Menu popover content &ndash;&gt;-->
<!--                                <v-card flat color="secondary" tile>-->
<!--                                  <v-card-title>-->
<!--                                    Ordered {{item.previousOrderDetails.length}} times-->
<!--                                  </v-card-title>-->
<!--                                  <v-card-text>-->
<!--                                    <customer-book-item-results :items="item.previousOrderDetails"-->
<!--                                                                :loading="false"-->
<!--                                                                :hide-add-btn="true"-->
<!--                                                                :customer_id="customer.id"/>-->
<!--                                  </v-card-text>-->
<!--                                </v-card>-->
<!--                                &lt;!&ndash; Menu popover content &ndash;&gt;-->

<!--                              </v-menu>-->
<!--                            </template>-->
<!--                          </v-combobox>-->
                        </td>

                        <td style="width: 15%;">
                          <v-combobox v-model="item.item_price" :items="item.price_list"
                                      item-text="price" item-value="name" type="number" hide-details
                                      @change="setItemPriceObjectAndInitPackagingAndUnits(item)"
                                      prefix="₹" return-object :rules="[rules.required]">
                            <template slot="item" slot-scope="{ item }">
                              <v-list-item-content
                                v-if="item.price !== undefined && item.price !== null">
                                <v-list-item-title v-text="'₹ ' + item.price"></v-list-item-title>
                                <v-list-item-subtitle
                                  v-text="'Packaging - ' + item.name"></v-list-item-subtitle>
                              </v-list-item-content>
                            </template>
                          </v-combobox>
                          <p class="font-weight-bold text-center mb-0"
                             v-if="checkIfDiscountEnabled(item)">
                            <a @click="applyItemPriceDiscount(item)"
                               v-if="!item.is_discount_applied">
                              Apply discount
                            </a>
                            <b class="d-block text--secondary" v-else>Discount applied!</b>
                            <b class="d-block">({{customer.primary_discount}} % +
                              {{customer.secondary_discount}} %)</b>
                          </p>
                          <p class="font-weight-bold text-center mb-0 error--text" v-else>
                            Discount not applicable
                          </p>
                        </td>

                        <td style="width: 22%;">
                          <v-layout align-baseline>
                            <v-flex xs3 sm3 md3>
                              <v-text-field v-model="item.packaging" type="number"
                                            hide-details
                                            @input="setItemTotalQuantity(item)"
                                            :rules="[rules.required]">
                              </v-text-field>
                            </v-flex>
                            <v-flex xs1 sm1 md1>
                              X
                            </v-flex>
                            <v-flex xs3 sm3 md3>
                              <v-text-field v-model="item.no_of_items" type="number"
                                            hide-details
                                            @input="setItemTotalQuantity(item)"
                                            :rules="[rules.required]">
                              </v-text-field>
                            </v-flex>
                            <v-flex xs5 sm5 md5>
                              <v-text-field v-model="item.total_quantity" readonly disabled
                                            hide-details
                                            prefix="= " :suffix="packagingType === 1 ? 'Kg': 'ℓ'">
                              </v-text-field>
                            </v-flex>
                          </v-layout>
                        </td>

                        <td style="width: 10%;">
                          <v-flex>
                            <v-text-field v-model="item.price_per_kg" readonly disabled
                                          :suffix="'/ ' + item.units_for_display"
                                          hide-details>
                            </v-text-field>
                          </v-flex>
                        </td>

                        <td style="width: 15%;">
                          <v-combobox v-model="item.item_hsn" :items="hsnList" type="number"
                                      hide-details
                                      return-object @input="calculateHSNSummary()"
                                      :rules="[rules.required]">
                          </v-combobox>
                        </td>

                        <td style="width: 6%;">{{item.units_for_display}}</td>

                        <td style="width: 2%;"><v-icon @click="deleteItem(item)">mdi-delete</v-icon></td>

                        <td class="text-right">₹ {{item.item_amount}}</td>
                      </tr>
                      <!-- Items row -->

                      <tr>
                        <td><h4>Total sum</h4></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style="border-top: 1px solid black" class="text-right font-weight-bold">
                          ₹ {{itemSummary.items_amount_sum}}
                        </td>
                      </tr>

                      <tr>
                        <td><h4>Insurance on sale (+)</h4></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          <v-text-field v-model="itemSummary.insurance_percentage" type="number"
                                        @input="setInsuranceAmount()" step="0.01" hide-details>
                          </v-text-field>
                        </td>
                        <td></td>
                        <td></td>
                        <td class="text-right">% {{itemSummary.insurance_percentage}}</td>
                      </tr>

                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style="border-top: 1px solid black" class="text-right font-weight-bold">
                          ₹ {{itemSummary.insurance_percentage_amount}}
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <v-select :items="Object.values(this.postageOptionsList())"
                                    v-model="postageSelectedText" suffix="(+)">
                          </v-select>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          <v-text-field v-model="itemSummary.postage_charge" type="number"
                                        @input="setPostageAmount()" step="0.01" hide-details>
                          </v-text-field>
                        </td>
                        <td></td>
                        <td></td>
                        <td class="text-right">₹ {{itemSummary.postage_charge}}</td>
                      </tr>

                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style="border-top: 1px solid black" class="text-right font-weight-bold">
                          ₹ {{itemSummary.amount_after_postage}}
                        </td>
                      </tr>

                      <tr>
                        <td><h4>Discount (-)</h4></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          <v-text-field v-model="itemSummary.discount" type="number"
                                        @input="setDiscountAmount()"
                                        hide-details>
                          </v-text-field>
                          <p v-if="customer.freight_allowed"
                             class="text-center error--text mb-0 font-weight-bold">
                            {{customer.freight_type + ' freight'}}
                          </p>
                        </td>
                        <td></td>
                        <td></td>
                        <td class="text-right">₹ {{itemSummary.discount}}</td>
                      </tr>

                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td style="border-top: 1px solid black" class="text-right font-weight-bold">
                          ₹ {{itemSummary.amount_after_discount}}
                        </td>
                      </tr>

                      <tr v-if="!isSameStateInvoice">
                        <td><h4>IGST-OUTPUT</h4></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          <v-text-field v-model="itemSummary.igst_percentage" type="number"
                                        @input="setIGSTAmount()" step="0.01" hide-details>
                          </v-text-field>
                        </td>
                        <td></td>
                        <td></td>
                        <td class="text-right">₹ {{itemSummary.igst_percentage_amount}}</td>
                      </tr>

                      <tr v-if="isSameStateInvoice">
                        <td><h4>CGST-OUTPUT</h4></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          <v-text-field v-model="itemSummary.cgst_percentage" type="number"
                                        @input="setCGSTAmount()" step="0.01" hide-details>
                          </v-text-field>
                        </td>
                        <td></td>
                        <td></td>
                        <td class="text-right">₹ {{itemSummary.cgst_percentage_amount}}</td>
                      </tr>

                      <tr v-if="isSameStateInvoice">
                        <td><h4>SGST-OUTPUT</h4></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          <v-text-field v-model="itemSummary.sgst_percentage" type="number"
                                        @input="setSGSTAmount()" step="0.01" hide-details>
                          </v-text-field>
                        </td>
                        <td></td>
                        <td></td>
                        <td class="text-right">₹ {{itemSummary.sgst_percentage_amount}}</td>
                      </tr>

                      <tr>
                        <td><h4>Round Off ({{itemSummary.round_off_difference_polarity}})</h4>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="text-right">₹ {{itemSummary.round_off_difference}}</td>
                      </tr>

                      <tr style="border-top: 1px solid black;">
                        <td>
                          <h4>Total</h4>
                        </td>
                        <td></td>
                        <td class="text-right font-weight-bold">
                          {{itemSummary.total_quantity_sum}} {{packagingType === 1 ? 'Kg': 'ℓ'}}s
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="text-right font-weight-bold">₹ {{itemSummary.total_after_round_off}}</td>
                      </tr>

                      <tr></tr>

                      <tr>
                        <td colspan="8" class="text-uppercase">
                          Amount chargeable in words : <b>INR
                          {{itemSummary.total_after_round_off_in_words}} ONLY</b>
                        </td>
                      </tr>
                    </tbody>

                  </v-simple-table>
                </v-form>

                <v-simple-table v-if="!isSameStateInvoice" class="ma-4">
                  <thead>
                    <tr>
                      <th v-for="header in hsnIGSTHeaders" :key="header.value"
                          :class="header.value !== 'hsn' ? 'text-right': 'text-left'">
                        {{header.text}}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="(item, index) in hsnSummary" :key="index">
                      <td>{{item.hsn}}</td>
                      <td class="text-right">₹ {{item.taxable_value}}</td>
                      <td class="text-right">% {{item.igst_rate}}</td>
                      <td class="text-right">₹ {{item.amount}}</td>
                      <td class="text-right">₹ {{item.total_tax_amount}}</td>
                    </tr>

                    <tr style="border-top: 1px solid white">
                      <td class="font-weight-bold">Total</td>
                      <td class="font-weight-bold text-right">
                        ₹ {{hsnSummaryTotal.total_taxable_value}}
                      </td>
                      <td></td>
                      <td class="font-weight-bold text-right">
                        ₹ {{hsnSummaryTotal.total_integrated_tax_amount}}
                      </td>
                      <td class="font-weight-bold text-right">
                        ₹ {{hsnSummaryTotal.total_integrated_tax_amount}}
                      </td>
                    </tr>
                    <tr></tr>

                    <tr>
                      <td colspan="7" class="text-uppercase">
                        Tax Amount (in words) : <b>INR {{taxAmountInWords}} ONLY</b>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>

                <v-simple-table v-if="isSameStateInvoice" class="ma-4">
                  <thead>
                  <tr>
                    <th v-for="header in hsnCGSTHeaders" :key="header.value"
                        :class="header.value !== 'hsn' ? 'text-right': 'text-left'">
                      {{header.text}}
                    </th>
                  </tr>
                  </thead>

                  <tbody>
                  <tr v-for="(item, index) in hsnSummary" :key="index">
                    <td>{{item.hsn}}</td>
                    <td class="text-right">₹ {{item.taxable_value}}</td>
                    <td class="text-right">% {{item.cgst_rate}}</td>
                    <td class="text-right">₹ {{item.cgst_amount}}</td>
                    <td class="text-right">% {{item.sgst_rate}}</td>
                    <td class="text-right">₹ {{item.sgst_amount}}</td>
                    <td class="text-right">₹ {{item.total_tax_amount}}</td>
                  </tr>

                  <tr style="border-top: 1px solid white">
                    <td class="font-weight-bold">Total</td>
                    <td class="font-weight-bold text-right">
                      ₹ {{hsnSummaryTotal.total_taxable_value}}
                    </td>
                    <td></td>
                    <td class="font-weight-bold text-right">
                      ₹ {{hsnSummaryTotal.total_central_tax_amount}}
                    </td>
                    <td></td>
                    <td class="font-weight-bold text-right">
                      ₹ {{hsnSummaryTotal.total_state_tax_amount}}
                    </td>
                    <td class="font-weight-bold text-right">
                      ₹ {{hsnSummaryTotal.total_combined_tax_amount}}
                    </td>
                  </tr>
                  <tr></tr>

                  <tr>
                    <td colspan="7" class="text-uppercase">
                      Tax Amount (in words) : <b>INR {{taxAmountInWords}} ONLY</b>
                    </td>
                  </tr>
                  </tbody>
                </v-simple-table>
              </div>
            </v-flex>
          </v-layout>

        </v-tab-item>
      </v-tabs>
    </v-card-text>

    <v-snackbar v-model="showToast" :color="toastColor" :timeout="toastTimeout" bottom right>
      {{ toastMessage }}
      <v-btn dark text @click="showToast = false">Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<style lang="scss">
  .item-search-card {
    position: absolute;
    z-index: 999;
  }
</style>

<script>
import CustomerBookItemResults from '../../../components/CustomerBookItemResults.vue';

const writtenNumber = require('written-number');

export default {
  data() {
    return {
      editInvoiceFormValid: false,
      rules: {
        required: (value) => !!value || 'Required.'
      },
      printInvoiceComponent: null,
      customerBookComponent: null,
      sampleCommentsComponent: null,
      printData: {},
      isDataLoading: true,
      isSameStateInvoice: false,
      packagingType: 0,
      companyDetails: {},
      id: '',
      invoiceNo: '',
      invoiceStatus: '',
      invoiceDate: '',
      invoiceDateMenu: false,
      deliveryNote: '',
      termsOfPayment: '',
      supplierRef: '',
      otherReferences: '',
      consigneeDetails: {},
      buyersOrderNo: '',
      dated: '',
      datedMenu: false,
      despatchDocumentNo: '',
      despatchDate: '',
      despatchDateMenu: false,
      transports: [],
      despatchThrough: '',
      despatchThroughGST: '',
      destination: '',
      vehicleNo: '',
      buyerAadhar: '',
      pmNo: '',
      noOfPackages: '',
      eSugamNo: '',
      grossWeight: '',
      termsOfDelivery: '',
      customer: {},
      headers: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Price (₹)',
          value: 'price'
        },
        {
          text: 'Packaging(gm) x No of packages',
          value: 'packaging'
        },
        {
          text: '(₹)',
          value: 'price_per_kg'
        },
        {
          text: 'HSN/SAC',
          value: 'hsn'
        },
        {
          text: 'per',
          value: 'units_for_display'
        },
        {
          text: '',
          value: 'action'
        },
        {
          text: 'Amount (₹)',
          value: 'item_amount',
          width: '8%'
        }
      ],
      hsnIGSTHeaders: [
        {
          text: 'HSN/SAC',
          value: 'hsn'
        },
        {
          text: 'Taxable value (₹)',
          value: 'taxable_value'
        },
        {
          text: 'IGST rate (%)',
          value: 'integrated_tax_rate'
        },
        {
          text: 'IGST amount (₹)',
          value: 'integrated_tax_amount'
        },
        {
          text: 'Total tax amount (₹)',
          value: 'total_tax_amount'
        }
      ],
      hsnCGSTHeaders: [
        {
          text: 'HSN/SAC',
          value: 'hsn'
        },
        {
          text: 'Taxable value (₹)',
          value: 'taxable_value'
        },
        {
          text: 'CGST rate (%)',
          value: 'central_tax_rate'
        },
        {
          text: 'CGST amount (₹)',
          value: 'central_tax_amount'
        },
        {
          text: 'SGST rate (%)',
          value: 'state_tax_rate'
        },
        {
          text: 'SGST amount (₹)',
          value: 'state_tax_amount'
        },
        {
          text: 'Total tax amount (₹)',
          value: 'total_tax_amount'
        }
      ],
      menuListHeaders: [
        {
          text: 'Price(₹)',
          sortable: false
        },
        {
          text: 'Packaging',
          sortable: false
        },
        {
          text: 'Date',
          sortable: false
        }
      ],
      brandName: '',
      goodsDescription: '',
      sampleComments: '',
      itemArray: [],
      itemSummary: {},
      hsnList: [],
      hsnSummary: [],
      hsnSummaryTotal: {},
      taxAmountInWords: '',
      previousInvoiceDate: null,
      nextInvoiceDate: null,
      invoiceFinancialYear: '',
      postageTextOptions: null,
      postageSelectedText: '',
      writtenNumberOptions: { lang: 'enIndian', baseSeparator: '-', unitSeparator: 'and ' },
      fab: false,
      showToast: false,
      toastMessage: '',
      toastColor: '',
      toastTimeout: 5000
    };
  },

  components: { CustomerBookItemResults },

  beforeRouteEnter(to, from, next) {
    next(
      (vm) => vm.$http.get(process.env.VUE_APP_REST_URL + '/invoices/' + to.params.id,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        vm.setIncomingData(response.data);
      }, (response) => {
      })
    );

    // Transports API
    next(
      (vm) => vm.$http.get(process.env.VUE_APP_REST_URL + '/transports',
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        vm.setIncomingTransportsData(response.data);
      }, (response) => {
      })
    );
  },

  methods: {
    onScroll(e) {
      if (typeof window === 'undefined') return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 120;
    },

    floatingPercentage(percent, number, significantDigits) {
      if (significantDigits !== undefined && significantDigits !== null) {
        return parseFloat(parseFloat((parseFloat(percent) / 100) * parseFloat(number)).toFixed(significantDigits));
      }
      return parseFloat(parseFloat((parseFloat(percent) / 100) * parseFloat(number)).toFixed(2));
    },

    floatingAddition(number1, number2) {
      return parseFloat((parseFloat(number1) + parseFloat(number2)).toFixed(2));
    },

    floatingSubtraction(number1, number2) {
      return parseFloat((parseFloat(number1) - parseFloat(number2)).toFixed(2));
    },

    floatingMultiplication(number1, number2) {
      return parseFloat((parseFloat(number1) * parseFloat(number2)).toFixed(2));
    },

    floatingDivision(number1, number2) {
      return parseFloat((parseFloat(number1) / parseFloat(number2)).toFixed(2));
    },

    setIncomingData(invoiceData) {
      this.id = invoiceData.id;
      this.invoiceNo = invoiceData.invoice_no;
      this.invoiceStatus = invoiceData.invoice_status;
      this.packagingType = invoiceData.packaging_type;
      this.isSameStateInvoice = invoiceData.is_same_state_invoice;
      this.companyDetails = invoiceData.company_details;
      this.invoiceDate = invoiceData.invoice_date.split('T')[0];
      this.deliveryNote = invoiceData.delivery_note;
      this.termsOfPayment = invoiceData.terms_of_payment;
      this.supplierRef = invoiceData.supplier_ref;
      this.otherReferences = invoiceData.other_references;
      this.consigneeDetails = invoiceData.consignee_details;
      this.customer = invoiceData.customer;
      this.buyersOrderNo = invoiceData.buyers_order_no;
      this.buyerAadhar = invoiceData.buyer_aadhar;
      this.dated = invoiceData.dated.split('T')[0];
      this.despatchDocumentNo = invoiceData.despatch_document_no;
      this.despatchDate = invoiceData.delivery_note_date.split('T')[0];
      this.despatchThrough = invoiceData.despatched_through;
      this.despatchThroughGST = invoiceData.despatched_through_gst;
      this.destination = invoiceData.destination;
      this.vehicleNo = invoiceData.vehicle_no;
      this.pmNo = invoiceData.pm_no;
      this.noOfPackages = invoiceData.no_of_packages;
      this.eSugamNo = invoiceData.e_sugam_no;
      this.grossWeight = invoiceData.gross_weight;
      this.termsOfDelivery = invoiceData.terms_of_delivery;
      this.brandName = invoiceData.brand_name;
      this.goodsDescription = invoiceData.goods_description;
      this.sampleComments = invoiceData.sample_comments;
      this.itemArray = invoiceData.item_array;
      this.itemSummary = invoiceData.item_summary;
      this.hsnList = invoiceData.company.hsn_list;
      this.taxAmountInWords = invoiceData.tax_amount_in_words;
      this.invoiceFinancialYear = invoiceData.financial_year;
      this.postageTextOptions = invoiceData.postage_text_options;
      this.postageSelectedText = this.postageOptionsList()[this.postageTextOptions];

      if (invoiceData.tax_summary !== undefined && invoiceData.tax_summary !== null) {
        this.hsnSummary = invoiceData.tax_summary.hsn_summary;
        this.hsnSummaryTotal = invoiceData.tax_summary.hsn_summary_total;
      }

      // Assign units to each item in itemArray on initialise
      const vm = this;
      this.itemArray.forEach((item) => {
        item.units_for_display = vm.setUnitForItem(item);
      });

      // Get previous & next invoice date
      this.getPreviousAndNextInvoiceDate(this.id, invoiceData.company_id);
    },

    setIncomingTransportsData(transportsData) {
      this.transports = transportsData;
    },

    getPreviousAndNextInvoiceDate(invoice_id, company_id) {
      const vm = this;
      vm.$http.get(process.env.VUE_APP_REST_URL + '/previous_and_next_invoice?for_invoice_no_as_int='
        + parseInt(invoice_id, 10) + '&company_id=' + company_id + '&financial_year='
        + vm.currentlySelectedFinancialYear,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then((response) => {
        if (response.data !== undefined && response.data !== null) {
          if (typeof response.data === 'object') {
            // Set previous & next invoice dates as min & max
            if (response.data.previous_invoice !== undefined && response.data.previous_invoice !== null) {
              vm.previousInvoiceDate = response.data.previous_invoice.invoice_date.split('T')[0];
            } else {
              vm.previousInvoiceDate = null;
            }

            if (response.data.next_invoice !== undefined && response.data.next_invoice !== null) {
              vm.nextInvoiceDate = response.data.next_invoice.invoice_date.split('T')[0];
            } else {
              vm.nextInvoiceDate = null;
            }
          }
        }
      }, (response) => {
      });
    },

    deleteItem(item) {
      const index = this.itemArray.indexOf(item);
      if (index !== -1) this.itemArray.splice(index, 1);

      const vm = this;
      vm.itemArray.forEach((rowItem) => {
        // Check item_price, packaging, no_of_items, item_hsn are present
        vm.editInvoiceFormValid = !(rowItem.item_price === undefined || rowItem.item_price === null
          || rowItem.packaging === undefined || rowItem.packaging === null
          || rowItem.no_of_items === undefined || rowItem.no_of_items === null
          || rowItem.item_hsn === undefined || rowItem.item_hsn === null);
      });
    },

    setDespatchDetails() {
      if (this.despatchThrough !== undefined && this.despatchThrough !== null) {
        if (typeof this.despatchThrough === 'object') {
          this.despatchThroughGST = this.despatchThrough.gst_no;
          this.despatchThrough = this.despatchThrough.name;
        }
      }
    },

    showSearchCard(item, index) {
      if (document.getElementById('search-card-' + index)) {
        document.getElementById('search-card-' + index).style.visibility = 'visible';
      }
    },

    closeSearchCard(index) {
      if (document.getElementById('search-card-' + index)) {
        document.getElementById('search-card-' + index).style.visibility = 'hidden';
      }
    },

    cleanIncomingItemSearchData(perfumesBeforeFormatting) {
      // Based on packaging type remove item prices. Also remove prices for undefined or null prices
      // #1. kg/dozen/piece
      // #2. litre
      const vm = this;
      const perfumesAfterFormatting = [];
      if (this.packagingType === 1) {
        perfumesBeforeFormatting.forEach((value) => {
          // Remove the keys which are undefined or null from the value
          Object.keys(value).forEach((v) => {
            if (value[v] === undefined || value[v] === null) {
              delete value[v];
            }
          });

          // Remove litre price from this item
          delete value.litre_price;
          perfumesAfterFormatting.push(value);
        });
      } else if (this.packagingType === 2) {
        perfumesBeforeFormatting.forEach((value) => {
          // Remove items which don't have a litre price
          if ('litre_price' in value) {
            if (value.litre_price !== undefined && value.litre_price !== null) {
              // Delete all prices except litre price
              Object.keys(value).forEach((v) => {
                if (v === 'one_tenth_price' || v === 'quarter_price' || v === 'half_price'
                  || v === 'bulk_price' || v === 'one_tenth_piece_price' || v === 'quarter_piece_price'
                  || v === 'dozen_price') {
                  delete value[v];
                }
              });

              perfumesAfterFormatting.push(value);
            }
          }
        });
      }
      return perfumesAfterFormatting;
    },

    reformatOrderedItemsForDisplay(data) {
      const result = [];
      Object.values(data).forEach((group) => {
        group.forEach((ordered_item) => {
          result.push(ordered_item);
        });
      });
      return result;
    },

    itemTyped(item) {
      // Search for an item via API
      const vm = this;
      const query = item.item_name;
      item.isItemsLoading = true;
      if (query !== '' && query !== null) {
        if (query.length > 2) {
          // Search for items
          vm.$http.get(process.env.VUE_APP_REST_URL + '/items?search_term=' + query,
            {
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
            }).then((response) => {
            if (response.data.length > 0) {
              item.returned_items = vm.cleanIncomingItemSearchData(response.data);
              item.isItemsLoading = false;
              item.showSearchCard = true;
            } else {
              delete item.returned_items;
              delete item.isItemsLoading;
              delete item.showSearchCard;
            }

            // Search for previously ordered items
            // Add fields for showing if individual item was ordered by a customer in the past
            item.wasItemPreviouslyOrdered = false;
            item.previousOrderDetails = [];

            vm.$http.post(process.env.VUE_APP_REST_URL + '/search_ordered_items_by_name',
              {
                customer_id: vm.customer.id,
                search_term: query
              },
              {
                headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                }
              }).then((response1) => {
              // Match name of the entered item with the response
              item.previousOrderDetails = vm.reformatOrderedItemsForDisplay(response1.data);
              if (item.previousOrderDetails.length > 0) {
                item.wasItemPreviouslyOrdered = true;
              }
            }, (response1) => {
            });
          }, (response) => {
          });
        }
      }
    },

    addOrderedItemToInvoice(orderedItem, index) {
      const resultingItem = {
        item_name: orderedItem.item_name,
        item_price: orderedItem.item_price,
        units_for_display: orderedItem.units_for_display,
        total_quantity: parseFloat(orderedItem.total_quantity),
        packaging: parseFloat(orderedItem.packaging),
        no_of_items: parseInt(orderedItem.no_of_items, 10),
        item_hsn: orderedItem.item_hsn,
        price_per_kg: parseFloat(orderedItem.price_per_kg),
        item_amount: parseFloat(orderedItem.item_amount),
        subitems: []
      };

      this.itemArray[index] = resultingItem;
      this.closeSearchCard(index);
      this.setItemPriceObjectAndInitPackagingAndUnits(resultingItem);
    },

    setItemNameObjectAndInitPriceList(item, selectedItemFromSearch, index) {
      item.item_obj = selectedItemFromSearch;
      item.item_name = selectedItemFromSearch.name;

      // Set a price list for this item
      const priceList = [];
      if (item.item_obj.one_tenth_price !== undefined && item.item_obj.one_tenth_price !== null) {
        priceList.push({ name: '25 gm', price: item.item_obj.one_tenth_price, weight: 25 });
      }

      if (item.item_obj.quarter_price !== undefined && item.item_obj.quarter_price !== null) {
        priceList.push({ name: '100 gm', price: item.item_obj.quarter_price, weight: 100 });
      }

      if (item.item_obj.half_price !== undefined && item.item_obj.half_price !== null) {
        priceList.push({ name: '500gm', price: item.item_obj.half_price, weight: 500 });
      }

      if (item.item_obj.half_price !== undefined && item.item_obj.half_price !== null) {
        priceList.push({ name: '1Kg', price: item.item_obj.half_price, weight: 1000 });
      }

      if (item.item_obj.bulk_price !== undefined && item.item_obj.bulk_price !== null) {
        priceList.push({ name: '5kg', price: item.item_obj.bulk_price, weight: 5000 });
      }

      if (item.item_obj.bulk_price !== undefined && item.item_obj.bulk_price !== null) {
        priceList.push({ name: '30Kg', price: item.item_obj.bulk_price, weight: 30000 });
      }

      if (item.item_obj.dozen_price !== undefined && item.item_obj.dozen_price !== null) {
        priceList.push({ name: 'dozen', price: item.item_obj.dozen_price, weight: 25 });
      }

      if (item.item_obj.quarter_piece_price !== undefined && item.item_obj.quarter_piece_price !== null) {
        priceList.push({ name: '100gm/piece', price: item.item_obj.quarter_piece_price, weight: 100 });
      }

      if (item.item_obj.one_tenth_piece_price !== undefined && item.item_obj.one_tenth_piece_price !== null) {
        priceList.push({ name: '25gm/piece', price: item.item_obj.one_tenth_piece_price, weight: 25 });
      }

      if (item.item_obj.litre_price !== undefined && item.item_obj.litre_price !== null) {
        priceList.push({ name: 'litre', price: item.item_obj.litre_price, weight: 1 });
      }
      item.price_list = priceList;

      // Close the search card once the item is selected & price list has been formed
      this.closeSearchCard(index);
    },

    checkIfDiscountEnabled(item) {
      // Only return false if discount is not enabled
      if (item.item_obj !== undefined && item.item_obj !== null) {
        if (item.item_obj.is_discount_enabled !== undefined && item.item_obj.is_discount_enabled !== null) {
          return item.item_obj.is_discount_enabled;
        }
        return true;
      }
      return true;
    },

    formatSubItems(item) {
      if (item.subitems !== undefined && item.subitems !== null) {
        if (item.subitems.length > 0) {
          item.subitems.forEach((subitem, k) => {
            if (typeof subitem !== 'object') {
              item.subitems[k] = {
                subitems: subitem
              };
            }
          });
        }
      }
    },

    setItemPriceObjectAndInitPackagingAndUnits(item) {
      // Set the item_price object & item_price
      if (item.item_price !== undefined && item.item_price !== null) {
        if (typeof item.item_price === 'object') {
          item.packaging = parseInt(item.item_price.weight, 10);

          item.item_price_obj = item.item_price;
          item.item_price = item.item_price.price;
        } else {
          delete item.item_price_obj;
        }
        item.item_price = parseFloat(item.item_price);
      }

      // Set the unit for this item on price change
      item.units_for_display = this.setUnitForItem(item);
      this.setItemTotalQuantity(item);
    },

    applyItemPriceDiscount(item) {
      item.is_discount_applied = false;

      if (this.customer.primary_discount !== 0) {
        item.is_discount_applied = true;
        item.item_price = this.floatingPercentage(
          parseFloat(100.00 - this.customer.primary_discount), item.item_price, 3
        );
      }

      if (this.customer.secondary_discount !== 0) {
        item.is_discount_applied = true;
        item.item_price = this.floatingPercentage(
          parseFloat(100.00 - this.customer.secondary_discount), item.item_price, 3
        );
      }

      this.setItemPriceObjectAndInitPackagingAndUnits(item);
      return item;
    },

    setUnitForItem(item) {
      if (item.item_obj !== undefined && item.item_obj !== null) {
        // Check the invoice packaging type
        if (this.packagingType === 1) {
          // Check the selected price type
          if (item.item_price_obj !== undefined && item.item_price_obj !== null) {
            if (item.item_price_obj.name === 'dozen') {
              return 'doz';
            } if (item.item_price_obj.name.includes('piece')) {
              return 'pc';
            }
            return 'kg';
          }
          return 'kg';
        } if (this.packagingType === 2) {
          return 'ℓ';
        }
      } else {
        return 'kg';
      }
    },

    setItemTotalQuantity(item) {
      if (item.packaging !== undefined && item.packaging !== null && item.no_of_items !== undefined
          && item.no_of_items !== null) {
        if (this.packagingType === 1) {
          if (item.units_for_display === 'doz') {
            item.total_quantity = (this.floatingMultiplication((item.packaging * 12), item.no_of_items) / 1000).toFixed(3);
          } else {
            item.total_quantity = (this.floatingMultiplication(item.packaging, item.no_of_items) / 1000).toFixed(3);
          }
        } else if (this.packagingType === 2) {
          item.total_quantity = (this.floatingMultiplication(item.packaging, item.no_of_items)).toFixed(3);
        }
      } else {
        item.total_quantity = (0).toFixed(3);
      }

      this.setPricePerKilo(item);
    },

    setPricePerKilo(item) {
      if (item.item_price !== undefined && item.item_price !== null && item.packaging !== undefined
          && item.packaging !== null) {
        if (this.packagingType === 1) {
          // Per kg calculation
          if (item.units_for_display === 'kg') {
            // Check if the packaging is more than 1000 gm
            if (parseInt(item.packaging, 10) > 0 && parseInt(item.packaging, 10) <= 100) {
              item.price_per_kg = this.floatingDivision(
                this.floatingMultiplication(1000, item.item_price), item.packaging
              );
            } else if (parseInt(item.packaging, 10) >= 101 && parseInt(item.packaging, 10) < 1000) {
              item.price_per_kg = item.item_price;
            } else {
              item.price_per_kg = item.item_price;
            }
          } else if (item.units_for_display === 'doz' || item.units_for_display === 'pc') {
            item.price_per_kg = item.item_price;
          }
        } else if (this.packagingType === 2) {
          item.price_per_kg = item.item_price;
        }
      }
      this.setTotalPriceForItem(item);
    },

    setTotalPriceForItem(item) {
      if (item.total_quantity !== undefined && item.total_quantity !== null && item.price_per_kg !== undefined
          && item.price_per_kg !== null) {
        if (this.packagingType === 1) {
          if (item.units_for_display === 'kg') {
            item.item_amount = this.floatingMultiplication(item.price_per_kg, item.total_quantity);
          } else if (item.units_for_display === 'doz' || item.units_for_display === 'pc') {
            item.item_amount = this.floatingMultiplication(item.price_per_kg, item.no_of_items);
          }
        } else if (this.packagingType === 2) {
          item.item_amount = this.floatingMultiplication(item.price_per_kg, item.total_quantity);
        }
      }
      this.calculateTotalItemsAmountSum();
    },

    calculateTotalItemsAmountSum() {
      let sum = 0;
      let quantitySum = 0;
      const vm = this;
      if (this.itemArray.length > 0) {
        this.itemArray.forEach((itemRow) => {
          if (itemRow.item_amount !== undefined && itemRow.item_amount !== null && itemRow.item_amount !== '') {
            sum = vm.floatingAddition(sum, itemRow.item_amount);
            quantitySum = (parseFloat(quantitySum) + parseFloat(itemRow.total_quantity)).toFixed(3);
          }
        });
      }

      // eslint-disable-next-line no-restricted-globals
      if (isNaN(sum)) {
        sum = 0;
      }
      this.itemSummary.items_amount_sum = sum;
      this.itemSummary.total_quantity_sum = quantitySum;
      this.setInsuranceAmount();
    },

    setInsuranceAmount() {
      if (this.itemSummary.insurance_percentage !== undefined && this.itemSummary.insurance_percentage !== null
          && this.itemSummary.items_amount_sum !== undefined && this.itemSummary.items_amount_sum !== null) {
        this.itemSummary.insurance_percentage_amount = this.floatingPercentage(this.itemSummary.insurance_percentage, this.itemSummary.items_amount_sum);

        this.itemSummary.amount_after_insurance = this.floatingAddition(this.itemSummary.items_amount_sum, this.itemSummary.insurance_percentage_amount);
      } else {
        this.itemSummary.amount_after_insurance = 0.00;
      }
      this.setPostageAmount();
    },

    setPostageAmount() {
      // Check if item_amount_after_insurance is present
      if (this.itemSummary.amount_after_insurance !== undefined && this.itemSummary.amount_after_insurance !== null
          && this.itemSummary.postage_charge !== undefined && this.itemSummary.postage_charge !== null) {
        this.itemSummary.amount_after_postage = this.floatingAddition(this.itemSummary.amount_after_insurance, this.itemSummary.postage_charge);
      } else {
        this.itemSummary.amount_after_postage = 0.00;
      }
      this.setDiscountAmount();
    },

    setDiscountAmount() {
      // Check if item_amount_after_postage is present
      if (this.itemSummary.amount_after_postage !== undefined && this.itemSummary.amount_after_postage !== null
          && this.itemSummary.discount !== undefined && this.itemSummary.discount !== null) {
        this.itemSummary.amount_after_discount = this.floatingSubtraction(this.itemSummary.amount_after_postage, this.itemSummary.discount);
      } else {
        this.itemSummary.amount_after_discount = 0.00;
      }
      this.setIGSTAmount();
      this.setCGSTAmount();
      this.setSGSTAmount();
    },

    setIGSTAmount() {
      if (this.itemSummary.igst_percentage !== undefined && this.itemSummary.igst_percentage !== null
          && this.itemSummary.amount_after_discount !== undefined && this.itemSummary.amount_after_discount !== null) {
        this.itemSummary.igst_percentage_amount = this.floatingPercentage(this.itemSummary.igst_percentage, this.itemSummary.amount_after_discount);
      }
      this.calculateTotalAmount();
    },

    setCGSTAmount() {
      if (this.itemSummary.cgst_percentage !== undefined && this.itemSummary.cgst_percentage !== null
          && this.itemSummary.amount_after_discount !== undefined && this.itemSummary.amount_after_discount !== null) {
        this.itemSummary.cgst_percentage_amount = this.floatingPercentage(this.itemSummary.cgst_percentage, this.itemSummary.amount_after_discount);
      }
      this.calculateTotalAmount();
    },

    setSGSTAmount() {
      if (this.itemSummary.sgst_percentage !== undefined && this.itemSummary.sgst_percentage !== null
          && this.itemSummary.amount_after_discount !== undefined && this.itemSummary.amount_after_discount !== null) {
        this.itemSummary.sgst_percentage_amount = this.floatingPercentage(this.itemSummary.sgst_percentage, this.itemSummary.amount_after_discount);
      }
      this.calculateTotalAmount();
    },

    calculateTotalAmount() {
      if (this.itemSummary.amount_after_discount !== undefined && this.itemSummary.amount_after_discount !== null) {
        // Check if IGST, CGST or SGST is present
        let totalBeforeRoundOff = 0.00;
        totalBeforeRoundOff = parseFloat(this.itemSummary.amount_after_discount).toFixed(2);

        if (this.itemSummary.cgst_percentage_amount !== undefined && this.itemSummary.cgst_percentage_amount !== null
            && this.itemSummary.sgst_percentage_amount !== undefined && this.itemSummary.sgst_percentage_amount !== null) {
          totalBeforeRoundOff = this.floatingAddition(this.floatingAddition(this.itemSummary.amount_after_discount,
            this.itemSummary.cgst_percentage_amount), this.itemSummary.sgst_percentage_amount);
        }

        if (this.itemSummary.igst_percentage_amount !== undefined && this.itemSummary.igst_percentage_amount !== null) {
          totalBeforeRoundOff = this.floatingAddition(this.itemSummary.amount_after_discount, this.itemSummary.igst_percentage_amount);
        }

        this.itemSummary.total_after_round_off = Math.round(totalBeforeRoundOff).toFixed(2);
        this.itemSummary.round_off_difference = this.floatingSubtraction(this.itemSummary.total_after_round_off, totalBeforeRoundOff);

        // Set polarity of the round_off_difference
        if (Math.sign(this.itemSummary.round_off_difference) === -1) {
          this.itemSummary.round_off_difference_polarity = '-';
        } else if (Math.sign(this.itemSummary.round_off_difference) === 1) {
          this.itemSummary.round_off_difference_polarity = '+';
        } else {
          this.itemSummary.round_off_difference_polarity = '';
        }

        // Convert the total after round off to words
        this.itemSummary.total_after_round_off_in_words = writtenNumber(parseInt(this.itemSummary.total_after_round_off, 10), this.writtenNumberOptions);

        this.calculateHSNSummary();
      }
    },

    calculateHSNSummary() {
      const vm = this;
      if (vm.itemSummary.total_after_round_off !== undefined && vm.itemSummary.total_after_round_off !== null
          && vm.itemSummary.insurance_percentage !== undefined && vm.itemSummary.insurance_percentage !== null) {
        // Group items based on HSN
        const hsnGroup = [];
        vm.itemArray.forEach((v) => {
          const currentHSN = v.item_hsn;
          const taxableValue = parseFloat(parseFloat(v.item_amount).toFixed(2));

          if (hsnGroup.length === 0) {
            // Add the first element to the array
            hsnGroup.push({
              hsn: currentHSN,
              taxable_value: taxableValue,
              quantity: parseFloat(parseFloat(v.total_quantity).toFixed(3))
            });
          } else {
            // Check if any element after the first has the HSN that already exists
            let matchFound = false;
            hsnGroup.forEach((row) => {
              if (parseInt(currentHSN, 10) === parseInt(row.hsn, 10)) {
                row.taxable_value = vm.floatingAddition(row.taxable_value, taxableValue);
                row.quantity = parseFloat((parseFloat(row.quantity) + parseFloat(v.total_quantity)).toFixed(3));
                matchFound = true;
              }
            });

            if (matchFound === false) {
              hsnGroup.push({
                hsn: currentHSN,
                taxable_value: taxableValue,
                quantity: parseFloat(parseFloat(v.total_quantity).toFixed(3))
              });
            }
          }
        });

        // Construct the hsn_summary table based on the grouped hsn table.
        // 1. Adjust the taxable value including the insurance % & weighted postage
        // 2. Construct the hsn_summary array based on invoice type
        vm.hsnSummary = [];
        hsnGroup.forEach((row) => {
          // Apply insurance percentage & weighted postage on grouped hsn array to minimise decimal diff in
          // calculation.

          if (vm.itemSummary.insurance_percentage !== undefined && vm.itemSummary.insurance_percentage !== null) {
            row.taxable_value = vm.floatingAddition(
              vm.floatingPercentage(vm.itemSummary.insurance_percentage, row.taxable_value),
              row.taxable_value
            );
          }

          if (vm.itemSummary.postage_charge !== undefined && vm.itemSummary.postage_charge !== null) {
            row.taxable_value += parseFloat(parseFloat(parseFloat(row.quantity) / parseFloat(vm.itemSummary.total_quantity_sum))
                * parseFloat(vm.itemSummary.postage_charge).toFixed(2));

            row.taxable_value = parseFloat(parseFloat(row.taxable_value).toFixed(2));
          }

          if (vm.itemSummary.discount !== undefined && vm.itemSummary.discount !== null) {
            row.taxable_value -= parseFloat(parseFloat(parseFloat(row.quantity) / parseFloat(vm.itemSummary.total_quantity_sum))
                * parseFloat(vm.itemSummary.discount).toFixed(2));

            row.taxable_value = parseFloat(parseFloat(row.taxable_value).toFixed(2));
          }

          // Check if it's the same state invoice
          if (vm.isSameStateInvoice) {
            // CGST HSN Summary

            const currentItemCGSTAmount = vm.floatingPercentage(vm.itemSummary.cgst_percentage, row.taxable_value);

            const currentItemSGSTAmount = vm.floatingPercentage(vm.itemSummary.cgst_percentage, row.taxable_value);

            const currentItemTaxTotalAmount = vm.floatingAddition(currentItemCGSTAmount, currentItemSGSTAmount);

            vm.hsnSummary.push({
              hsn: row.hsn,
              taxable_value: row.taxable_value,
              cgst_rate: vm.itemSummary.cgst_percentage,
              cgst_amount: currentItemCGSTAmount,
              sgst_rate: vm.itemSummary.sgst_percentage,
              sgst_amount: currentItemSGSTAmount,
              total_tax_amount: currentItemTaxTotalAmount
            });
          } else {
            // IGST HSN Summary

            const currentItemTaxAmount = vm.floatingPercentage(vm.itemSummary.igst_percentage, row.taxable_value);

            vm.hsnSummary.push({
              hsn: row.hsn,
              taxable_value: row.taxable_value,
              igst_rate: vm.itemSummary.igst_percentage,
              amount: currentItemTaxAmount,
              total_tax_amount: currentItemTaxAmount
            });
          }
        });

        // Calculate HSN Summary total from hsn_summary array
        if (vm.isSameStateInvoice) {
          // CGST & SGST HSN Summary
          vm.hsnSummaryTotal = {
            total_taxable_value: 0.00,
            total_central_tax_amount: 0.00,
            total_state_tax_amount: 0.00,
            total_combined_tax_amount: 0.00
          };
          vm.hsnSummary.forEach((summaryRow) => {
            vm.hsnSummaryTotal.total_taxable_value = vm.floatingAddition(vm.hsnSummaryTotal.total_taxable_value, summaryRow.taxable_value);

            vm.hsnSummaryTotal.total_central_tax_amount = vm.floatingAddition(vm.hsnSummaryTotal.total_central_tax_amount, summaryRow.cgst_amount);

            vm.hsnSummaryTotal.total_state_tax_amount = vm.floatingAddition(vm.hsnSummaryTotal.total_state_tax_amount, summaryRow.sgst_amount);

            vm.hsnSummaryTotal.total_combined_tax_amount = vm.floatingAddition(vm.hsnSummaryTotal.total_combined_tax_amount, summaryRow.total_tax_amount);
          });

          // Get the decimal part of total_combined_tax_amount
          const decimal = (vm.hsnSummaryTotal.total_combined_tax_amount + '').split('.')[1];
          let writtenDecimal = '';

          // Check if the decimal part is not 0
          if (parseInt(decimal, 10) !== 0) {
            writtenDecimal = ' AND ' + writtenNumber(parseInt(decimal, 10), vm.writtenNumberOptions) + ' PAISA';
          }

          // Convert the total after round off to words
          vm.taxAmountInWords = writtenNumber(parseInt(vm.hsnSummaryTotal.total_combined_tax_amount, 10),
            vm.writtenNumberOptions) + ' RUPEES ' + writtenDecimal;
        } else {
          // IGST HSN Summary
          vm.hsnSummaryTotal = {
            total_taxable_value: 0.00,
            total_integrated_tax_amount: 0.00
          };
          vm.hsnSummary.forEach((summaryRow) => {
            vm.hsnSummaryTotal.total_taxable_value = vm.floatingAddition(vm.hsnSummaryTotal.total_taxable_value, summaryRow.taxable_value);

            vm.hsnSummaryTotal.total_integrated_tax_amount = vm.floatingAddition(vm.hsnSummaryTotal.total_integrated_tax_amount, summaryRow.total_tax_amount);
          });

          // Get the decimal part of total_combined_tax_amount
          const decimal = (vm.hsnSummaryTotal.total_integrated_tax_amount + '').split('.')[1];
          let writtenDecimal = '';

          // Check if the decimal part is not 0
          if (parseInt(decimal, 10) !== 0) {
            writtenDecimal = ' AND ' + writtenNumber(parseInt(decimal, 10), vm.writtenNumberOptions) + ' PAISA';
          }

          // Convert the total after round off to words
          vm.taxAmountInWords = writtenNumber(parseInt(vm.hsnSummaryTotal.total_integrated_tax_amount, 10), vm.writtenNumberOptions)
            + ' RUPEES ' + writtenDecimal;
        }
      }
    },

    saveInvoice() {
      const vm = this;

      // Remove fields from item array
      vm.itemArray.forEach((item) => {
        // Check item_price, packaging, no_of_items, item_hsn are present
        if (item.item_price === undefined || item.item_price === null
            || item.packaging === undefined || item.packaging === null
            || item.no_of_items === undefined || item.no_of_items === null
            || item.item_hsn === undefined || item.item_hsn === null) {
          vm.editInvoiceFormValid = false;
        } else {
          vm.editInvoiceFormValid = true;
        }

        delete item.wasItemPreviouslyOrdered;
        delete item.previousOrderDetails;
        delete item.item_obj;
        delete item.item_price_obj;
        delete item.price_list;

        // Remove the keys added to item which were applied in - this.itemTyped(item) - function
        delete item.returned_items;
        delete item.isItemsLoading;
        delete item.showSearchCard;
      });

      if (vm.editInvoiceFormValid) {
        vm.$http.patch(process.env.VUE_APP_REST_URL + '/invoices/' + vm.id,
          {
            invoice: {
              invoice_status: 1,
              company_details: vm.companyDetails,
              consignee_details: vm.consigneeDetails,
              invoice_date: vm.invoiceDate,
              delivery_note: vm.deliveryNote,
              terms_of_payment: vm.termsOfPayment,
              supplier_ref: vm.supplierRef,
              other_references: vm.otherReferences,
              buyers_order_no: vm.buyersOrderNo,
              dated: vm.dated,
              despatch_document_no: vm.despatchDocumentNo,
              delivery_note_date: vm.despatchDate,
              despatched_through: vm.despatchThrough,
              despatched_through_gst: vm.despatchThroughGST,
              destination: vm.destination,
              vehicle_no: vm.vehicleNo,
              pm_no: vm.pmNo,
              no_of_packages: vm.noOfPackages,
              e_sugam_no: vm.eSugamNo,
              gross_weight: vm.grossWeight,
              terms_of_delivery: vm.termsOfDelivery,
              brand_name: vm.brandName,
              goods_description: vm.goodsDescription,
              item_array: vm.itemArray,
              item_summary: vm.itemSummary,
              amount_chargeable_in_words: vm.itemSummary.total_after_round_off_in_words,
              tax_summary: {
                hsn_summary: vm.hsnSummary,
                hsn_summary_total: vm.hsnSummaryTotal
              },
              tax_amount_in_words: vm.taxAmountInWords,
              buyer_aadhar: vm.buyerAadhar,
              last_edited_by_id: JSON.parse(localStorage.user_info).id,
              sample_comments: vm.sampleComments,
              postage_text_options: vm.postageOptionsKeyByValue(vm.postageSelectedText)
            }
          },
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          }).then((response) => {
          // Show success toast
          vm.showToast = true;
          vm.toastMessage = 'Successfully saved item';
          vm.toastColor = 'success';
          vm.editInvoiceFormValid = true;
        }, (response) => {
          // error callback. Show error alert
          vm.showToast = true;
          vm.toastMessage = 'Something went wrong';
          vm.toastColor = 'error';
          vm.editInvoiceFormValid = true;
        });
      }
    },

    printInvoice() {
      const vm = this;
      this.printData = {
        company_details: vm.companyDetails,
        consignee_details: vm.consigneeDetails,
        invoice_date: vm.invoiceDate,
        is_same_state_invoice: vm.isSameStateInvoice,
        packaging_type: vm.packagingType,
        delivery_note: vm.deliveryNote,
        invoice_no: vm.invoiceNo,
        terms_of_payment: vm.termsOfPayment,
        supplier_ref: vm.supplierRef,
        other_references: vm.otherReferences,
        buyers_order_no: vm.buyersOrderNo,
        dated: vm.dated,
        despatch_document_no: vm.despatchDocumentNo,
        delivery_note_date: vm.despatchDate,
        despatched_through: vm.despatchThrough,
        despatched_through_gst: vm.despatchThroughGST,
        destination: vm.destination,
        vehicle_no: vm.vehicleNo,
        pm_no: vm.pmNo,
        no_of_packages: vm.noOfPackages,
        e_sugam_no: vm.eSugamNo,
        gross_weight: vm.grossWeight,
        terms_of_delivery: vm.termsOfDelivery,
        brand_name: vm.brandName,
        goods_description: vm.goodsDescription,
        item_array: vm.itemArray,
        item_summary: vm.itemSummary,
        amount_chargeable_in_words: vm.itemSummary.total_after_round_off_in_words,
        tax_summary: {
          hsn_summary: vm.hsnSummary,
          hsn_summary_total: vm.hsnSummaryTotal
        },
        tax_amount_in_words: vm.taxAmountInWords,
        buyer_aadhar: vm.buyerAadhar,
        sample_comments: vm.sampleComments,
        postage_text_options: vm.postageSelectedText
      };
      this.printInvoiceComponent = () => import('../../../components/PrintInvoice.vue');
    },

    openSampleCommentsDialog() {
      this.sampleCommentsComponent = () => import('../../../components/SampleComments.vue');
    },

    openCustomerBookDialog() {
      this.customerBookComponent = () => import('../../../components/CustomerBook.vue');
    },

    deleteInvoice() {
      const vm = this;
      if (confirm('Are you sure you want to delete this invoice?')) {
        this.$http.delete(process.env.VUE_APP_REST_URL + '/invoices/' + this.id,
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          }).then((response) => {
          // Show success toast
          vm.showToast = true;
          vm.toastMessage = 'Successfully deleted item';
          vm.toastColor = 'success';

          setTimeout(() => {
            vm.$router.push({ path: '/dashboard/main' });
          }, 1000);
        }, (response) => {
          // error callback. Show error alert
          vm.showToast = true;
          vm.toastMessage = 'Something went wrong';
          vm.toastColor = 'error';
        });
      }
    }
  }
};
</script>
