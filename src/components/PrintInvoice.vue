<template>
  <!-- Print invoice from here -->
  <div id="invoicePrint" style="display: none">

    <div id="printableArea"
         style="font-size: 7.5pt; border: 1px solid black; position: absolute; height: calc(100% - 2px); width: calc(100% - 2px); top: 0;left: 0;">
      <p style="position: relative; text-align: center;font-weight: 700;font-size: 9pt;margin: 0;display: block;">TAX
        INVOICE</p>

      <div style="width: 100%; display: block; padding: 0; position: relative; border-bottom: 1px solid black;
                 border-top: 1px solid black; height: 300px; overflow: hidden; font-size: 8.5pt; line-height: 8.3pt">

        <!---- First Parent Column --->
        <div style="width: 50%;float: left; height: 100%;">
          <!---- Company details row ---->
          <div style="height: 50%; border-bottom: 1px solid black">
            <p style="margin: 0; font-weight: bold; font-size: 9.5pt; line-height: 9pt; text-transform: uppercase">
              <u style="text-transform: capitalize">Consigner</u>
              <br>
              <br><b style="font-size: 11pt">{{companyDetails.name}}</b>
              <br/>{{companyDetails.st_address}}
              <br/>{{companyDetails.city}} - {{companyDetails.postcode}}
              <br/> Ph No - {{companyDetails.phone_no}}
              <br/> GSTIN/UIN - {{companyDetails.gstin_no}}
              <br/> PAN - {{companyDetails.pan_no}}
              <br/> State Name - {{companyDetails.state_name}}, Code - {{companyDetails.code}}
              <br/> Email - {{companyDetails.contact_email}}
            </p>
          </div>
          <!---- Company details row ---->

          <!---- Consignee details row ---->
          <div style="height: calc(50% - 1px); border-bottom: 1px solid black">
            <p style="margin: 0; font-weight: bold; font-size: 9.5pt; line-height: 9pt; text-transform: uppercase">
              <u style="text-transform: capitalize">Consignee</u>
              <br>
              <br><b style="font-size: 11pt">{{consigneeDetails.name}}</b>
              <br>{{consigneeDetails.st_address}}
              <br>{{consigneeDetails.city}}
              <span v-if="consigneeDetails.postcode !== '' && consigneeDetails.postcode !== null">
                - {{consigneeDetails.postcode}}
              </span>
              <br> Ph No - {{consigneeDetails.phone_no}}
              <br> GSTIN/UIN - {{consigneeDetails.gstin_no}}
              <br> PAN - {{consigneeDetails.pan_no}}, Buyer's Aadhar : {{consigneeDetails.aadhar_no}}
              <br> State Name - {{consigneeDetails.state_name}}, Code - {{consigneeDetails.code}}
              <br> Email - {{consigneeDetails.contact_email}}
            </p>
          </div>
          <!---- Consignee details row ---->

        </div>
        <!---- First Parent Column --->

        <!---- Second Parent Column --->
        <div style="width: calc(50% - 1px); border-left: 1px solid black; float: right; height: 100%;">

          <!----- Row 1 --->
          <div style="height: 99px; border-bottom: 1px solid black;">
            <div style="width: 50%; border-right: 1px solid black; float: left;">
              <div style="width: 100%;border-bottom: 1px solid black;height: 32px;align-content: flex-start;">
                <b style="margin-left: 1px">Invoice No</b>
                <p style="margin: 0 0 0 3px; font-weight: bold">{{invoiceNo}}</p>
              </div>
              <div style="width: 100%; border-bottom: 1px solid black; height: 32px;">
                <b style="margin-left: 1px">Delivery Note</b>
                <p style="margin: 0 0 0 3px; font-weight: bold">{{deliveryNote}}</p>
              </div>
              <div style="width: 100%;height: 33px;">
                <b style="margin-left: 1px">Suppliers Ref.</b>
                <p style="margin: 0 0 0 3px; font-weight: bold">{{supplierRef}}</p>
              </div>
            </div>

            <div style="width: calc(50% - 1px); float: right;">
              <div style="width: 100%; border-bottom: 1px solid black; height: 32px; align-content: flex-start;">
                <b style="margin-left: 1px">Dated</b>
                <p style="margin: 0 0 0 3px; font-weight: bold">{{calendarDate(invoiceDate)}}</p>
              </div>
              <div style="width: 100%; border-bottom: 1px solid black; height: 32px;">
                <b style="margin-left: 1px">Mode / Terms of Payment</b>
                <p style="margin: 0 0 0 3px; font-weight: bold">{{termsOfPayment}}</p>
              </div>
              <div style="width: 100%;height: 33px;">
                <b style="margin-left: 1px">Other Reference(s)</b>
                <p style="margin: 0 0 0 3px; font-weight: bold">{{otherReferences}}</p>
              </div>
            </div>
          </div>
          <!----- Row 1 --->

          <!----- Row 2 --->
          <div style="height: 99px; border-bottom: 1px solid black">
            <div style="width: 50%; border-right: 1px solid black; float: left;">
              <div style="width: 100%; border-bottom: 1px solid black; height: 32px; align-content: flex-start;">
                <b style="margin-left: 1px">Buyer's Order No.</b>
                <p style="margin: 0 0 0 3px; font-weight: bold">{{buyersOrderNo}}</p>
              </div>
              <div style="width: 100%; border-bottom: 1px solid black; height: 32px;">
                <b style="margin-left: 1px">Despatch Document No.</b>
                <p style="margin: 0 0 0 3px; font-weight: bold">{{despatchDocumentNo}}</p>
              </div>
              <div style="width: 100%;height: 33px;">
                <b style="margin-left: 1px">Despatched through</b>
                <p style="margin: 0 0 0 3px; font-weight: bold">{{despatchedThrough}}</p>
              </div>
            </div>

            <div style="width: calc(50% - 1px);float: right;">
              <div style="width: 100%; border-bottom: 1px solid black; height: 32px; align-content: flex-start;">
                <b style="margin-left: 1px">Dated</b>
                <p style="margin: 0 0 0 3px; font-weight: bold">{{calendarDate(dated)}}</p>
              </div>
              <div style="width: 100%; border-bottom: 1px solid black; height: 32px;">
                <b style="margin-left: 1px">Despatch Date</b>
                <p style="margin: 0 0 0 3px; font-weight: bold">{{calendarDate(deliveryNoteDate)}}</p>
              </div>
              <div style="width: 100%;height: 33px;">
                <b style="margin-left: 1px">Destination</b>
                <p style="margin: 0 0 0 3px; font-weight: bold">{{destination}}</p>
              </div>
            </div>
          </div>
          <!----- Row 2 --->

          <!----- Row 3 --->
          <div style="height: 99px;">
            <div style="width: 50%; border-right: 1px solid black; float: left; position: relative;">
              <div style="width: 100%; border-bottom: 1px solid black; height: 28px">
                <b style="margin-left: 1px">P.M No.</b>
                <p style="margin: 0 0 0 3px; font-weight: bold">{{pmNo}}</p>
              </div>
              <div style="width: 100%; border-bottom: 1px solid black; height: 28px">
                <b style="margin-left: 1px">e-Waybill No.</b>
                <p style="margin: 0 0 0 3px; font-weight: bold">{{eSugamNo}}</p>
              </div>
              <div style="width: 100%; height: 42px">
                <b style="margin-left: 1px">Terms of delivery</b>
                <p style="margin: 0 0 0 3px; font-weight: bold">{{termsOfDelivery}}</p>
              </div>
            </div>

            <div style="width: calc(50% - 1px); float: right; position: relative;">
              <div style="width: 100%; border-bottom: 1px solid black; height: 28px">
                <b style="margin-left: 1px">No of packages</b>
                <p style="margin: 0 0 0 3px; font-weight: bold">{{noOfPackages}}</p>
              </div>
              <div style="width: 100%; border-bottom: 1px solid black; height: 28px">
                <b style="margin-left: 1px">Gross Wt.</b>
                <p style="margin: 0 0 0 3px; font-weight: bold">{{grossWeight}}</p>
              </div>
              <div style="width: 100%; height: 42px">
                <b style="margin-left: 1px">Vehicle no</b>
                <p style="margin: 0 0 0 3px; font-weight: bold">{{vehicleNo}}</p>
              </div>
            </div>
          </div>
          <!----- Row 3 --->
        </div>
        <!---- Second Parent Column --->

      </div>

      <div style="width: 100%; text-transform: capitalize; text-align: center; font-size: 9pt;
                 position: relative; border-bottom: 1px solid black;">
        {{brandName}}
      </div>

      <div style="width: 100%; text-transform: capitalize; text-align: center; font-size: 9pt;
                 position: relative; border-bottom: 1px solid black;">
        {{goodsDescription}}
      </div>

      <table
        style="padding: 0; margin: 0; width: 100%; border-bottom: 1px solid black; font-size: 7.5pt; height: 500px; position: relative;">
        <thead>
        <tr>
          <th style="width: 3%; font-size: 7pt; text-align: center">No.</th>
          <th style="width: 20%; font-size: 7pt; text-align: center">Pkgs.</th>
          <th style="width: 35%; font-size: 7pt; text-align: center">Description of Goods</th>
          <th style="width: 4%; font-size: 7pt; text-align: center">HSN/SAC</th>
          <th style="width: 10%; font-size: 7pt; text-align: center">Quantity</th>
          <th style="width: 5%; font-size: 7pt; text-align: center">Rate</th>
          <th style="width: 3%; font-size: 7pt; text-align: center">per</th>
          <th style="width: 20%; font-size: 7pt; text-align: center">Amount</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, key, index) in itemArray">
          <td style="text-align: center; font-size: 7.5pt">{{key + 1}}</td>

          <!--- Conditional display --->
          <td style="text-align: center; font-size: 7.5pt">
                            <span v-if="unitsForDisplay(item) === 'kg'">
                                {{item.no_of_items}} x {{getPackagingForPrint(item.packaging)}}
                            </span>
            <span v-if="unitsForDisplay(item) === 'doz'">
                                {{item.no_of_items}} dozen
                            </span>
            <span v-if="unitsForDisplay(item) === 'pc'">
                                {{item.no_of_items}} x {{getPackagingForPrint(item.packaging)}}
                            </span>
            <span v-if="unitsForDisplay(item) === 'ℓ'">
                                {{item.no_of_items}} x {{item.packaging}} ltr
                            </span>
          </td>
          <!--- Conditional display --->

          <td style="text-align: center; font-size: 7.5pt">
            {{item.item_name}} <br>
            <span v-for="subitem in item.subitems"
                  v-if="item.subitems !== undefined && item.subitems !== null && item.subitems.length > 0">
                                ({{subitem.subitems + '. '}})
                            </span>
          </td>

          <td style="text-align: center; font-size: 7.5pt">{{item.item_hsn}}</td>

          <td style="text-align: center; font-size: 7.5pt">
                            <span v-if="unitsForDisplay(item) === 'kg'">
                                {{item.total_quantity}} Kgs
                            </span>
            <span v-if="unitsForDisplay(item) === 'doz'">
                                {{item.no_of_items}} doz
                            </span>
            <span v-if="unitsForDisplay(item) === 'pc'">
                                {{item.no_of_items}} pc
                            </span>
            <span v-if="unitsForDisplay(item) === 'ℓ'">
                                {{item.total_quantity}} ltr
                            </span>
          </td>

          <td style="text-align: center; font-size: 7.5pt">{{item.price_per_kg}}</td>

          <td style="text-align: center; font-size: 7.5pt">
                            <span v-if="unitsForDisplay(item) === 'kg'">
                                Kgs
                            </span>
            <span v-if="unitsForDisplay(item) === 'doz'">
                                doz
                            </span>
            <span v-if="unitsForDisplay(item) === 'pc'">
                                pc
                            </span>
            <span v-if="unitsForDisplay(item) === 'ℓ'">
                                ltr
                            </span>
          </td>

          <td style="text-align: right; font-size: 7.5pt">{{item.item_amount}}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td style="border-top: 1px solid black; text-align: right;">
            {{itemSummary.items_amount_sum}}
          </td>
        </tr>
        <tr v-show="checkIfZero(itemSummary.insurance_percentage)">
          <td></td>
          <td></td>
          <td style="text-align: right;">Insurance on Sale (+)</td>
          <td></td>
          <td></td>
          <td style="text-align: right;">{{itemSummary.insurance_percentage}}</td>
          <td style="text-align: right;">%</td>
          <td style="text-align: right;">{{itemSummary.insurance_percentage_amount}}</td>
        </tr>
        <tr v-show="checkIfZero(itemSummary.insurance_percentage)">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td style="border-top: 1px solid black; text-align: right;">{{itemSummary.amount_after_insurance}}</td>
        </tr>
        <tr v-show="checkIfZero(itemSummary.postage_charge)">
          <td></td>
          <td></td>
          <td style="text-align: right;">Postage & courier charge (+)</td>
          <td></td>
          <td></td>
          <td style="text-align: right;">{{itemSummary.postage_charge}}</td>
          <td style="text-align: right;"></td>
          <td style="text-align: right;">{{itemSummary.postage_charge}}</td>
        </tr>
        <tr v-show="checkIfZero(itemSummary.postage_charge)">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td style="border-top: 1px solid black; text-align: right;">{{itemSummary.amount_after_postage}}</td>
        </tr>
        <tr v-show="checkIfZero(itemSummary.discount)">
          <td></td>
          <td></td>
          <td style="text-align: right;">Discount (-)</td>
          <td></td>
          <td></td>
          <td style="text-align: right;">{{itemSummary.discount}}</td>
          <td style="text-align: right;"></td>
          <td style="text-align: right;">{{itemSummary.discount}}</td>
        </tr>
        <tr v-show="checkIfZero(itemSummary.discount)">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td style="border-top: 1px solid black; text-align: right">{{itemSummary.amount_after_discount}}</td>
        </tr>
        <tr v-show="!isSameStateInvoice">
          <td></td>
          <td></td>
          <td style="text-align: right;">IGST-OUTPUT@{{itemSummary.igst_percentage}}%</td>
          <td></td>
          <td></td>
          <td style="text-align: right;">{{itemSummary.igst_percentage}}</td>
          <td style="text-align: right;">%</td>
          <td style="text-align: right;">{{itemSummary.igst_percentage_amount}}</td>
        </tr>
        <tr v-show="isSameStateInvoice">
          <td></td>
          <td></td>
          <td style="text-align: right;">CGST-OUTPUT@{{itemSummary.cgst_percentage}}%</td>
          <td></td>
          <td></td>
          <td style="text-align: right;">{{itemSummary.cgst_percentage}}</td>
          <td style="text-align: right;">%</td>
          <td style="text-align: right;">{{itemSummary.cgst_percentage_amount}}</td>
        </tr>
        <tr v-show="isSameStateInvoice">
          <td></td>
          <td></td>
          <td style="text-align: right;">SGST-OUTPUT@{{itemSummary.sgst_percentage}}%</td>
          <td></td>
          <td></td>
          <td style="text-align: right;">{{itemSummary.sgst_percentage}}</td>
          <td style="text-align: right;">%</td>
          <td style="text-align: right;">{{itemSummary.cgst_percentage_amount}}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td style="text-align: right;">Round Off ({{itemSummary.round_off_difference_polarity}})</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td style="text-align: right;">{{itemSummary.round_off_difference}}</td>
        </tr>
        <tr>
          <td style="border-top: 1px solid black"></td>
          <td style="border-top: 1px solid black"></td>
          <td style="border-top: 1px solid black; text-align: right;">Total</td>
          <td style="border-top: 1px solid black"></td>
          <td style="border-top: 1px solid black; text-align: right;">
                            <span v-if="packagingType === 1">
                                {{itemSummary.total_quantity_sum}} Kgs
                            </span>
            <span v-if="packagingType === 2">
                                {{itemSummary.total_quantity_sum}} ltrs
                            </span>
          </td>
          <td style="border-top: 1px solid black"></td>
          <td style="border-top: 1px solid black"></td>
          <td style="border-top: 1px solid black; text-align: right;"><b><i class="fa fa-rupee"></i>{{itemSummary.total_after_round_off}}</b>
          </td>
        </tr>
        </tbody>
      </table>

      <div
        style="width: 100%; text-transform: capitalize; font-size: 9pt; position: relative; border-bottom: 1px solid black;"
        v-if="sampleComments !== undefined && sampleComments !== null && sampleComments !== ''">
        <b>Sample comments:</b> {{sampleComments}}
      </div>

      <div
        style="width: 100%; text-transform: capitalize; font-size: 7.5pt; border-bottom: 1px solid black; padding-top: 2px">
        Amount Chargeable (in words):
        <b style="text-transform: uppercase">INR {{itemSummary.total_after_round_off_in_words}} ONLY</b>
        <span style="float: right;">E. & O.E.</span>
      </div>

      <div style="width: 100%; display: block; position: relative; padding: 0; height: 30px;"
           v-if="!isSameStateInvoice">

        <!------------- Header ---------->
        <div style="border-right: 1px solid black; border-bottom: 1px solid black; width: calc(50% - 1px);
                     border-collapse: collapse; float: left; text-align: center; font-size: 6pt; height: 18px;">
          HSN/SAC
        </div>
        <div style="border-bottom: 1px solid black; width: calc(50%); border-collapse: collapse; float: right;
                     font-size: 6pt; height: 18px;">
          <div style="border-right: 1px solid black; text-align: center; width: calc(30% - 1px); float: left;
                         font-size: 6pt; height: 18px;">
            Taxable Value
          </div>

          <div
            style="border-right: 1px solid black; text-align: center; width: calc(40% - 1px); float: left; font-size: 6pt; height: 18px;">
            <div style="width: 100%; border-bottom: 1px solid black">
              Integrated Tax
            </div>
            <div style="width: 100%">
              <div style="width: calc(50% - 1px); border-right: 1px solid black; float: left;">Rate</div>
              <div style="width: 50%;float: right;">Amount</div>
            </div>
          </div>

          <div style="text-align: center; width: calc(30%); float: left; font-size: 6pt; height: 18px;">
            Total Tax Amount
          </div>
        </div>
        <!------------- Header ---------->

        <!-------------- Body ----------->
        <div style="width: 100%; display: block; border-collapse: collapse; padding: 0;">
          <div style="border-right: 1px solid black; border-bottom: 1px solid black; width: calc(50% - 1px);
                         border-collapse: collapse; float: left; font-size: 7pt;">
                            <span v-for="row in hsnSummary" style="margin-left: 1px">
                                {{row.hsn}}<br>
                            </span>
          </div>
          <div
            style="border-bottom: 1px solid black; width: calc(50% - 1px); border-collapse: collapse; float: right; font-size: 7pt;">
            <div
              style="border-right: 1px solid black; text-align: right; width: calc(30% - 1px); float: left; font-size: 7pt;">
                                <span v-for="row in hsnSummary" style="margin-right: 1px">
                                    {{row.taxable_value}}<br>
                                </span>
            </div>

            <div style="border-right: 1px solid black; width: calc(40% - 1px); float: left; font-size: 7pt;">
              <div style="border-right: 1px solid black; width: calc(50% - 1px); float: left;
                                 text-align: right; font-size: 7pt;">
                                    <span v-for="row in hsnSummary">
                                        {{row.igst_rate}} %<br>
                                    </span>
              </div>
              <div style="width: 50%; float: right; text-align: right; font-size: 7pt;">
                                    <span v-for="row in hsnSummary">
                                        {{row.amount}}<br>
                                    </span>
              </div>
            </div>

            <div style="text-align: right; width: calc(30%); float: left; font-size: 7pt;">
                                <span v-for="row in hsnSummary" style="margin-right: 1px">
                                    {{row.total_tax_amount}}<br>
                                </span>
            </div>
          </div>
        </div>

        <div style="width: 100%; display: block; border-collapse: collapse; padding: 0;">
          <div style="border-right: 1px solid black; border-bottom: 1px solid black; width: calc(50% - 1px);
                         border-collapse: collapse; float: left; font-size: 7pt;">
            <span style="margin-left: 1px">Total</span>
          </div>
          <div style="border-bottom: 1px solid black; width: calc(50% - 1px); border-collapse: collapse;
                         float: right; font-size: 7pt;">
            <div style="border-right: 1px solid black; text-align: right; width: calc(30% - 1px);
                             float: left; font-size: 7pt;">
              <span style="margin-right: 1px">{{hsnSummaryTotal.total_taxable_value}}</span>
            </div>

            <div style="border-right: 1px solid black; width: calc(40% - 1px); float: left; font-size: 7pt;">
              <div style="border-right: 1px solid black; width: calc(50% - 1px); float: left;
                                 text-align: right; font-size: 7pt;">
                &nbsp;
              </div>
              <div style="width: 50%; float: right; text-align: right; font-size: 7pt;">
                <span style="margin-right: 1px">{{hsnSummaryTotal.total_integrated_tax_amount}}</span>
              </div>
            </div>

            <div style="text-align: right; width: calc(30%); float: left; font-size: 7pt;">
              <span style="margin-right: 1px">{{hsnSummaryTotal.total_integrated_tax_amount}}</span>
            </div>
          </div>
        </div>


        <!-------------- Body ----------->
      </div>

      <div style="width: 100%; display: block; position: relative; padding: 0; height: 30px;" v-if="isSameStateInvoice">

        <!------------- Header ---------->
        <div style="border-right: 1px solid black; border-bottom: 1px solid black; width: calc(50% - 1px);
                     border-collapse: collapse; float: left; text-align: center; font-size: 6pt; height: 18px;">
          HSN/SAC
        </div>
        <div style="border-bottom: 1px solid black; width: 50%; border-collapse: collapse; float: right;
                     font-size: 6pt; height: 18px;">
          <div style="border-right: 1px solid black; text-align: center; width: calc(30% - 1px);
                         float: left; font-size: 6pt; height: 18px;">
            Taxable Value
          </div>

          <div style="border-right: 1px solid black; text-align: center; width: calc(20% - 1px);
                         float: left; font-size: 6pt; height: 18px;">
            <div style="width: 100%; border-bottom: 1px solid black">
              Central Tax
            </div>
            <div style="width: 100%">
              <div style="width: calc(50% - 1px); border-right: 1px solid black; float: left;">Rate</div>
              <div style="width: 50%;float: right;">Amount</div>
            </div>
          </div>

          <div style="border-right: 1px solid black; text-align: center; width: calc(20% - 1px);
                         float: left; font-size: 6pt; height: 18px;">
            <div style="width: 100%; border-bottom: 1px solid black">
              State Tax
            </div>
            <div style="width: 100%">
              <div style="width: calc(50% - 1px); border-right: 1px solid black; float: left;">Rate</div>
              <div style="width: 50%;float: right;">Amount</div>
            </div>
          </div>

          <div style="text-align: center; width: calc(30%); float: left; font-size: 6pt; height: 18px;">
            Total Tax Amount
          </div>
        </div>
        <!------------- Header ---------->

        <!-------------- Body ----------->
        <div style="width: 100%; display: block; border-collapse: collapse; padding: 0;">
          <div style="border-right: 1px solid black; border-bottom: 1px solid black;
                         width: calc(50% - 1px); border-collapse: collapse; float: left; font-size: 7pt;">
                            <span v-for="row in hsnSummary" style="margin-left: 1px">
                                {{row.hsn}}<br>
                            </span>
          </div>

          <div style="border-bottom: 1px solid black; width: 50%; border-collapse: collapse;
                         float: right; font-size: 7pt;">
            <div style="border-right: 1px solid black; text-align: right; width: calc(30% - 1px);
                             float: left; font-size: 7pt;">
                                <span v-for="row in hsnSummary" style="margin-right: 1px">
                                    {{row.taxable_value}}<br>
                                </span>
            </div>

            <div style="border-right: 1px solid black; width: calc(20% - 1px); float: left; font-size: 7pt;">
              <div style="border-right: 1px solid black; width: calc(50% - 1px); float: left;
                                 text-align: right; font-size: 7pt;">
                                    <span v-for="row in hsnSummary">
                                        {{row.cgst_rate}} %<br>
                                    </span>
              </div>

              <div style="width: 50%; float: right; text-align: right; font-size: 7pt;">
                                    <span v-for="row in hsnSummary">
                                        {{row.cgst_amount}}<br>
                                    </span>
              </div>
            </div>

            <div style="border-right: 1px solid black; width: calc(20% - 1px); float: left; font-size: 7pt;">
              <div style="border-right: 1px solid black; width: calc(50% - 1px); float: left;
                                 text-align: right; font-size: 7pt;">
                                    <span v-for="row in hsnSummary">
                                        {{row.sgst_rate}} %<br>
                                    </span>
              </div>
              <div style="width: 50%; float: right; text-align: right; font-size: 7pt;">
                                    <span v-for="row in hsnSummary">
                                        {{row.sgst_amount}}<br>
                                    </span>
              </div>
            </div>

            <div style="text-align: right; width: calc(30%); float: left; font-size: 7pt;">
                                <span v-for="row in hsnSummary" style="margin-right: 1px">
                                    {{row.total_tax_amount}}<br>
                                </span>
            </div>
          </div>
        </div>

        <div style="width: 100%; display: block; border-collapse: collapse; padding: 0;">
          <div style="border-right: 1px solid black; border-bottom: 1px solid black;
                         width: calc(50% - 1px); border-collapse: collapse; float: left; font-size: 7pt;">
            <span style="margin-left: 1px">Total</span>
          </div>
          <div style="border-bottom: 1px solid black; width: 50%; border-collapse: collapse;
                         float: right; font-size: 7pt;">
            <div style="border-right: 1px solid black; text-align: right; width: calc(30% - 1px);
                             float: left; font-size: 7pt;">
              <span style="margin-right: 1px">{{hsnSummaryTotal.total_taxable_value}}</span>
            </div>

            <div style="border-right: 1px solid black; width: calc(20% - 1px); float: left; font-size: 7pt;">
              <div style="border-right: 1px solid black; width: calc(50% - 1px); float: left;
                                 text-align: right; font-size: 7pt;">
                &nbsp;
              </div>
              <div style="width: 50%; float: right; text-align: right; font-size: 7pt;">
                <span style="margin-right: 1px">{{hsnSummaryTotal.total_central_tax_amount}}</span>
              </div>
            </div>

            <div style="border-right: 1px solid black; width: calc(20% - 1px); float: left; font-size: 7pt;">
              <div style="border-right: 1px solid black; width: calc(50% - 1px); float: left;
                                 text-align: right; font-size: 7pt;">
                &nbsp;
              </div>
              <div style="width: 50%; float: right; text-align: right; font-size: 7pt;">
                <span style="margin-right: 1px">{{hsnSummaryTotal.total_state_tax_amount}}</span>
              </div>
            </div>

            <div style="text-align: right; width: calc(30%); float: left; font-size: 7pt;">
              <span style="margin-right: 1px">{{hsnSummaryTotal.total_combined_tax_amount}}</span>
            </div>
          </div>
        </div>


        <!-------------- Body ----------->
      </div>

      <div style="width: 100%; display: block; padding: 0; position: absolute; bottom: 0; font-weight: bold">
        <div style="font-size: 7.5pt;margin-left: 1px;">
          Tax Amount (in words): <b style="text-transform: uppercase">INR {{taxAmountInWords}} ONLY</b>
        </div>
        <div style="border-collapse: collapse;font-size: 7.5pt;">
          <div style="width: calc(50% - 1px); float: left; padding-left: 1px;">
            <br>Company's PAN : {{companyDetails.pan_no}}
          </div>

          <div style="width: calc(50% - 1px);float: right;">
            Company's Bank Details
            <br>Bank Name : {{companyDetails.bank_name}}
            <br>A/c No. : {{companyDetails.bank_account_no}}
            <br>Branch & IFS Code : {{companyDetails.bank_branch}}
          </div>

          <div>
            <div style="float: left;width: 50%;">
              <br>
              <u>Terms</u>
              <br>1. Goods once sold will not be taken back under any circumstances
              <br>2. Not responsible for any loss, breakage or shortage in transit
              <br>3. All transactions are made under the jurisdiction of Delhi City Court only
            </div>

            <div style="float: right; width: calc(50% - 1px); border-left: 1px solid black;
                             border-top: 1px solid black; text-align: right;">
              for {{companyDetails.name}}
              <br>
              <br>
              <br>
              Authorised Signatory
            </div>
          </div>

        </div>
      </div>

    </div>

  </div>
  <!-- Print invoice from here -->
</template>

<script>
export default {
  data() {
    return {};
  },

  beforeCreate() {
    this.isSameStateInvoice = this.$attrs.data.is_same_state_invoice;
    this.packagingType = this.$attrs.data.packaging_type;
    this.companyDetails = this.$attrs.data.company_details;
    this.consigneeDetails = this.$attrs.data.consignee_details;

    this.invoiceNo = this.$attrs.data.invoice_no;
    this.deliveryNote = this.$attrs.data.delivery_note;
    this.supplierRef = this.$attrs.data.supplier_ref;

    this.invoiceDate = this.$attrs.data.invoice_date;
    this.termsOfPayment = this.$attrs.data.terms_of_payment;
    this.otherReferences = this.$attrs.data.other_references;

    this.buyersOrderNo = this.$attrs.data.buyers_order_no;
    this.despatchDocumentNo = this.$attrs.data.despatch_document_no;
    this.despatchedThrough = this.$attrs.data.despatched_through;

    this.dated = this.$attrs.data.dated;
    this.deliveryNoteDate = this.$attrs.data.delivery_note_date;
    this.destination = this.$attrs.data.destination;
    this.vehicleNo = this.$attrs.data.vehicle_no;

    this.pmNo = this.$attrs.data.pm_no;
    this.eSugamNo = this.$attrs.data.e_sugam_no;
    this.noOfPackages = this.$attrs.data.no_of_packages;
    this.grossWeight = this.$attrs.data.gross_weight;
    this.termsOfDelivery = this.$attrs.data.terms_of_delivery;

    this.brandName = this.$attrs.data.brand_name;
    this.goodsDescription = this.$attrs.data.goods_description;

    this.itemArray = this.$attrs.data.item_array;
    this.itemSummary = this.$attrs.data.item_summary;
    this.sampleComments = this.$attrs.data.sample_comments;

    this.hsnSummary = this.$attrs.data.tax_summary.hsn_summary;
    this.hsnSummaryTotal = this.$attrs.data.tax_summary.hsn_summary_total;
    this.taxAmountInWords = this.$attrs.data.tax_amount_in_words;
  },

  mounted() {
    const printContent = document.getElementById('invoicePrint');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  },

  methods: {
    unitsForDisplay(item) {
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

    getPackagingForPrint(packaging) {
      if (parseInt(packaging) < 1000) {
        return packaging + ' gms';
      }
      return (parseFloat(packaging) / 1000) + ' Kg';
    },

    checkIfZero(number) {
      if (number !== undefined && number !== null) {
        if (number === '0' || parseFloat(number) === 0) {
          return false;
        }
        return true;
      }
      return true;
    }
  }
};
</script>
