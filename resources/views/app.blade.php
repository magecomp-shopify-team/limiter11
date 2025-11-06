<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LIMITER Order Limits</title>
    <meta name="shopify-api-key" content="{{ config('shopify-app.api_key') }}" />
    <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
    <script type="application/json" id="shop_data">{!!  json_encode( $user)  !!}</script>
    <script type="application/json" id="planConfig">{!!  json_encode( $planConfig)  !!}</script>
    <script type="text/javascript">window.$crisp=[];window.CRISP_WEBSITE_ID="f2fbf04e-52f0-4818-83ec-ecd33dc5e388";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();</script>
</head>

<body>
    <script type="application/json"
        id="themeAppUrl">https://{{ auth()->user()->name }}/admin/themes/current/editor?context=apps&template=index&activateAppId={{config('shopify-app.theme_enable_id')}}/{{config('shopify-app.theme_uuid_url')}}</script>
    <div id="root"></div>

    @viteReactRefresh
    @vite('resources/react/app.jsx')
</body> 

</html>