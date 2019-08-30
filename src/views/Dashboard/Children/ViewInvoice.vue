<template>
  <v-card color="secondary" flat>
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

          <v-list-item @click="$router.push({ name: 'editInvoice', params: { id: id}})"
                       v-if="userDetails().permissions.invoice.edit">
            <v-list-item-title>Edit</v-list-item-title>
          </v-list-item>

          <v-list-item @click="openSampleCommentsDialog">
            <v-list-item-title>Sample comments</v-list-item-title>
          </v-list-item>

          <v-list-item @click="openCustomerBookDialog">
            <v-list-item-title>Customer book</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-card-text>
      <v-tabs fixed-tabs>
        <v-tab href="#itemAndHSN">Item & HSN</v-tab>
        <v-tab href="#aadharAndPackage">Aadhar, bank & package</v-tab>
        <v-tab href="#consigneeAndDelivery">Consignee & delivery</v-tab>
        <v-tab href="#companyAndInvoice">Company & invoice</v-tab>
        <v-tab href="#invoiceNotifications" v-if="invoiceNotifications.length > 0">
          <v-badge color="primary" top>
            <template v-slot:badge>
              {{invoiceNotifications.length}}
            </template>
            <span>Action History</span>
          </v-badge>
        </v-tab>

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
                      <span class="subheading d-block">Company name</span>
                      <span class="body-1 d-block">{{companyDetails.name}}</span>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Company st address</span>
                      <span class="body-1 d-block">{{companyDetails.st_address}}</span>
                    </v-flex>

                    <v-flex xs12 sm4 md4>
                      <span class="subheading d-block">Company city</span>
                      <span class="body-1 d-block">{{companyDetails.city}}</span>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <span class="subheading d-block">Company state</span>
                      <span class="body-1 d-block">{{companyDetails.state_name}}</span>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <span class="subheading d-block">Company postcode</span>
                      <span class="body-1 d-block">{{companyDetails.postcode}}</span>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Company phone no</span>
                      <span class="body-1 d-block">{{companyDetails.phone_no}}</span>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Company email</span>
                      <span class="body-1 d-block">{{companyDetails.contact_email}}</span>
                    </v-flex>

                    <v-flex xs12 sm4 md4>
                      <span class="subheading d-block">Company GSTIN/UIN</span>
                      <span class="body-1 d-block">{{companyDetails.gstin_no}}</span>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <span class="subheading d-block">Company PAN</span>
                      <span class="body-1 d-block">{{companyDetails.pan_no}}</span>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <span class="subheading d-block">Company code</span>
                      <span class="body-1 d-block">{{companyDetails.code}}</span>
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
                      <span class="subheading d-block">Brand name</span>
                      <span class="body-1 d-block">{{brandName}}</span>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Goods description</span>
                      <span class="body-1 d-block">{{goodsDescription}}</span>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Invoice no</span>
                      <span class="body-1 d-block">{{invoiceNo}}</span>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Invoice date</span>
                      <span class="body-1 d-block">{{calendarDate(invoiceDate)}}</span>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Delivery note</span>
                      <span class="body-1 d-block">{{deliveryNote}}</span>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Mode / Terms of payment</span>
                      <span class="body-1 d-block">{{termsOfPayment}}</span>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Suppliers ref</span>
                      <span class="body-1 d-block">{{supplierRef}}</span>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Other reference(s)</span>
                      <span class="body-1 d-block">{{otherReferences}}</span>
                    </v-flex>

                  </v-layout>
                </v-container>
              </v-flex>

              <v-flex xs12 sm12 md12 class="ml-3 mr-3 pa-2">
                <span class="subheading d-block">Sample comments</span>
                <span class="body-1 d-block">{{sampleComments}}</span>
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
                      <span class="subheading d-block">Consignee name</span>
                      <span class="body-1 d-block">{{consigneeDetails.name}}</span>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Consignee st address</span>
                      <span class="body-1 d-block">{{consigneeDetails.st_address}}</span>
                    </v-flex>

                    <v-flex xs12 sm4 md4>
                      <span class="subheading d-block">Consignee city</span>
                      <span class="body-1 d-block">{{consigneeDetails.city}}</span>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <span class="subheading d-block">Consignee state</span>
                      <span class="body-1 d-block">{{consigneeDetails.state_name}}</span>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <span class="subheading d-block">Consignee postcode</span>
                      <span class="body-1 d-block">{{consigneeDetails.postcode}}</span>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Consignee phone no</span>
                      <span class="body-1 d-block">{{consigneeDetails.phone_no}}</span>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Consignee email</span>
                      <span class="body-1 d-block">{{consigneeDetails.contact_email}}</span>
                    </v-flex>

                    <v-flex xs12 sm4 md4>
                      <span class="subheading d-block">Consignee GSTIN/UIN</span>
                      <span class="body-1 d-block">{{consigneeDetails.gstin_no}}</span>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <span class="subheading d-block">Consignee PAN</span>
                      <span class="body-1 d-block">{{consigneeDetails.pan_no}}</span>
                    </v-flex>
                    <v-flex xs12 sm4 md4>
                      <span class="subheading d-block">Consignee code</span>
                      <span class="body-1 d-block">{{consigneeDetails.code}}</span>
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
                      <span class="subheading d-block">Buyers Order no</span>
                      <span class="body-1 d-block">{{buyersOrderNo}}</span>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Dated</span>
                      <span class="body-1 d-block">{{calendarDate(dated)}}</span>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Despatch document no</span>
                      <span class="body-1 d-block">{{despatchDocumentNo}}</span>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Despatch date</span>
                      <span class="body-1 d-block">{{calendarDate(despatchDate)}}</span>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Despatch through</span>
                      <span class="body-1 d-block">{{despatchThrough}}</span>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Destination</span>
                      <span class="body-1 d-block">{{destination}}</span>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Vehicle no</span>
                      <span class="body-1 d-block">{{vehicleNo}}</span>
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
                      <span class="subheading d-block">Buyer aadhar</span>
                      <span class="body-1 d-block">{{buyerAadhar}}</span>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Bank name</span>
                      <span class="body-1 d-block">{{companyDetails.bank_name}}</span>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Company PAN (Same)</span>
                      <span class="body-1 d-block">{{companyDetails.pan_no}}</span>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">A/c no.</span>
                      <span class="body-1 d-block">{{companyDetails.bank_account_no}}</span>
                    </v-flex>

                    <v-flex xs12 sm12 md12>
                      <span class="subheading d-block">Branch & IFS Code</span>
                      <span class="body-1 d-block">{{companyDetails.bank_branch}}</span>
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
                      <span class="subheading d-block">P.M. no</span>
                      <span class="body-1 d-block">{{pmNo}}</span>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">No of packages</span>
                      <span class="body-1 d-block">{{noOfPackages}}</span>
                    </v-flex>

                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">e-Waybill no</span>
                      <span class="body-1 d-block">{{eSugamNo}}</span>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <span class="subheading d-block">Gross weight</span>
                      <span class="body-1 d-block">{{grossWeight}}</span>
                    </v-flex>

                    <v-flex xs12 sm12 md12>
                      <span class="subheading d-block">Terms of delivery</span>
                      <span class="body-1 d-block">{{termsOfDelivery}}</span>
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
                  <v-toolbar-title>Item details</v-toolbar-title>
                </v-toolbar>

                <div class="ma-4">
                  <!-- Items table -->
                  <v-simple-table>
                    <thead>
                      <tr>
                        <th v-for="header in headers" :key="header.value"
                            :class="header.value !== 'item_name' ? 'text-right': ''">
                          {{header.text}}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <!-- Items row -->
                      <tr v-for="(item, index) in itemArray" :key="index">
                        <td>{{item.item_name}}</td>
                        <td class="text-right">{{item.item_price}}</td>
                        <td class="text-right">
                          <v-layout align-baseline>
                            <v-flex>{{item.packaging}}</v-flex>
                            <v-flex>X</v-flex>
                            <v-flex>{{item.no_of_items}}</v-flex>
                            <v-flex>= {{item.total_quantity}} {{packagingType === 1 ? 'Kg': 'ℓ'}}</v-flex>
                          </v-layout>
                        </td>
                        <td class="text-right">{{item.price_per_kg}} / {{item.units_for_display}}</td>
                        <td class="text-right">{{item.item_hsn}}</td>
                        <td class="text-right">{{item.units_for_display}}</td>
                        <td class="text-right">{{item.item_amount}}</td>
                      </tr>
                      <!-- Items row -->

                      <!-- Summary row -->
                      <tr>
                        <td><h4>Total sum</h4></td>
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
                        <td class="text-right">
                          {{itemSummary.insurance_percentage}}
                        </td>
                        <td></td>
                        <td class="text-right">
                          <v-icon small>mdi-percent</v-icon> {{itemSummary.insurance_percentage}}
                        </td>
                      </tr>

                      <tr>
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
                        <td><h4>Postage & courier charge (+)</h4></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="text-right">{{itemSummary.postage_charge}}</td>
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
                        <td style="border-top: 1px solid black" class="text-right font-weight-bold">
                          ₹ {{itemSummary.amount_after_postage}}
                        </td>
                      </tr>

                      <tr>
                        <td><h4>Discount (-)</h4></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="text-right">{{itemSummary.discount}}</td>
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
                        <td style="border-top: 1px solid black" class="text-right font-weight-bold">
                          ₹ {{itemSummary.amount_after_discount}}
                        </td>
                      </tr>

                      <tr v-if="!isSameStateInvoice">
                        <td><h4>IGST-OUTPUT</h4></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="text-right">{{itemSummary.igst_percentage}}</td>
                        <td></td>
                        <td class="text-right">₹ {{itemSummary.igst_percentage_amount}}</td>
                      </tr>

                      <tr v-if="isSameStateInvoice">
                        <td><h4>CGST-OUTPUT</h4></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="text-right">{{itemSummary.cgst_percentage}}</td>
                        <td></td>
                        <td class="text-right">₹ {{itemSummary.cgst_percentage_amount}}</td>
                      </tr>

                      <tr v-if="isSameStateInvoice">
                        <td><h4>SGST-OUTPUT</h4></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="text-right">{{itemSummary.sgst_percentage}}</td>
                        <td></td>
                        <td class="text-right">₹ {{itemSummary.sgst_percentage_amount}}</td>
                      </tr>

                      <tr>
                        <td><h4>Round Off ({{itemSummary.round_off_difference_polarity}})</h4></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="text-right">₹ {{itemSummary.round_off_difference}}</td>
                      </tr>

                      <tr style="border-top: 1px solid black;">
                        <td><h4>Total</h4></td>
                        <td></td>
                        <td class="text-left font-weight-bold">
                          {{itemSummary.total_quantity_sum}} {{packagingType === 1 ? 'Kg': 'ℓ'}}s
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="text-right font-weight-bold">₹ {{itemSummary.total_after_round_off}}</td>
                      </tr>

                      <tr>
                        <td colspan="7" class="text-uppercase">
                          Amount chargeable in words : <b>INR {{itemSummary.total_after_round_off_in_words}} ONLY</b>
                        </td>
                      </tr>
                      <!-- Items row -->
                    </tbody>
                  </v-simple-table>
                  <!-- Items table -->

                  <!-- IGST Table -->
                  <v-simple-table v-if="!isSameStateInvoice">

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
                        <td class="text-right">
                          <v-icon small>mdi-percent</v-icon> {{item.igst_rate}}
                        </td>
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
                        <td colspan="7" style="text-transform: uppercase">
                          Tax Amount in words: <b>INR {{taxAmountInWords}} ONLY</b>
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                  <!-- IGST Table -->

                  <!-- CGST Table -->
                  <v-simple-table v-if="isSameStateInvoice">

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
                      <td class="text-right">
                        <v-icon small>mdi-percent</v-icon> {{item.cgst_rate}}
                      </td>
                      <td class="text-right">₹ {{item.cgst_amount}}</td>
                      <td class="text-right">
                        <v-icon small>mdi-percent</v-icon> {{item.sgst_rate}}
                      </td>
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
                      <td colspan="7" style="text-transform: uppercase">
                        Tax Amount in words: <b>INR {{taxAmountInWords}} ONLY</b>
                      </td>
                    </tr>
                    </tbody>
                  </v-simple-table>
                  <!-- CGST Table -->
                </div>
              </div>
            </v-flex>
          </v-layout>

        </v-tab-item>

        <v-tab-item value="invoiceNotifications">
          <v-timeline class="pa-4">
            <v-timeline-item v-for="(notification, index, key) in invoiceNotifications" :key="key" large>
              <v-avatar color="primary" class="white--text font-weight-bold" slot="icon" size="40">
                {{notification.actor_name.split(' ')[0].charAt(0) +
                notification.actor_name.split(' ')[1].charAt(0)}}
              </v-avatar>

              <v-card class="elevation-2" color="secondary">
                <v-list two-line color="secondary">
                  <v-list-item :key="key" ripple color="primary">

                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold">
                        {{notification.description}} by {{notification.actor_name}}
                      </v-list-item-title>

                    </v-list-item-content>

                    <v-list-item-action class="ml-2">
                      <v-list-item-action-text class="font-weight-bold">
                        {{calendarDate(notification.created_at)}}
                      </v-list-item-action-text>
                    </v-list-item-action>

                  </v-list-item>
                </v-list>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-tab-item>

      </v-tabs>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
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
      despatchThrough: '',
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
          value: 'item_name'
        },
        {
          text: 'Price (₹)',
          value: 'item_price'
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
          value: 'item_hsn'
        },
        {
          text: 'per',
          value: 'units_for_display'
        },
        {
          text: 'Amount (₹)',
          value: 'item_amount'
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
          value: 'igst_rate'
        },
        {
          text: 'IGST amount (₹)',
          value: 'amount'
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
      brandName: '',
      goodsDescription: '',
      sampleComments: '',
      itemArray: [],
      itemSummary: {},
      hsnList: [],
      hsnSummary: [],
      hsnSummaryTotal: {},
      taxAmountInWords: '',
      invoiceNotifications: '',
      writtenNumberOptions: { lang: 'enIndian', baseSeparator: '-', unitSeparator: 'and ' },
      invoiceFinancialYear: ''
    };
  },

  beforeRouteEnter(to, from, next) {
    next(
      vm => vm.$http.get(process.env.VUE_APP_REST_URL + '/invoices/' + to.params.id,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        vm.setIncomingData(response.data);
      }, (response) => {
      })
    );

    next(
      vm => vm.$http.get(process.env.VUE_APP_REST_URL + '/invoice_notifications?invoice_id=' + to.params.id,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
        vm.setInvoiceNotificationsData(response.data);
      }, (response) => {
      })
    );
  },

  methods: {
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

      if (invoiceData.tax_summary !== undefined && invoiceData.tax_summary !== null) {
        this.hsnSummary = invoiceData.tax_summary.hsn_summary;
        this.hsnSummaryTotal = invoiceData.tax_summary.hsn_summary_total;
      }
    },

    setInvoiceNotificationsData(invoiceNotificationsData) {
      this.invoiceNotifications = invoiceNotificationsData;
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
        sample_comments: vm.sampleComments
      };
      this.printInvoiceComponent = () => import('../../../components/PrintInvoice.vue');
    },

    openSampleCommentsDialog() {
      this.sampleCommentsComponent = () => import('../../../components/SampleComments.vue');
    },

    openCustomerBookDialog() {
      this.customerBookComponent = () => import('../../../components/CustomerBook.vue');
    }
  }
};
</script>
