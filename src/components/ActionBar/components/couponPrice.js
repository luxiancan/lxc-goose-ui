// 有可用返回price券后价 id优惠券id isNeedGetCoupon是否需要领券
// 无可用返回null
export function handleOptimalCoupon(myCouponList, getCouponList, originPrice, resourcePrice, isMarketing) {
  // 最优优惠券
  let optimalCoupon = null;
  let myCouponListBestOne = handleCouponList(originPrice, myCouponList, resourcePrice, isMarketing);
  let getCouponListBestOne = handleCouponList(originPrice, getCouponList, resourcePrice, isMarketing);
  myCouponListBestOne ? (myCouponListBestOne.isNeedGetCoupon = false) : '';
  getCouponListBestOne ? (getCouponListBestOne.isNeedGetCoupon = true) : '';
  // 都有效
  if (myCouponListBestOne && getCouponListBestOne) {
      if (myCouponListBestOne.price > getCouponListBestOne.price) {
          // 领取优惠券
          optimalCoupon = getCouponListBestOne;
      } else {
          optimalCoupon = myCouponListBestOne;
      }
  }
  // 我的优惠券
  if (myCouponListBestOne && !getCouponListBestOne) {
      optimalCoupon = myCouponListBestOne;
  }
  // 要领取
  if (getCouponListBestOne && !myCouponListBestOne) {
      optimalCoupon = getCouponListBestOne;
  }
  console.log(3333333333,myCouponListBestOne,getCouponListBestOne)
  return optimalCoupon;
}
function handleCouponList(originPrice, couponList, resourcePrice, isMarKeting) {
  let couponListBestOne = null;
  let tempCoupon = null;
  for (let i = 0; i < couponList.length; i++) {
      tempCoupon = handleCouponPrice(originPrice, couponList[i], resourcePrice, isMarKeting);

      if (!couponListBestOne && tempCoupon) {
          couponListBestOne = tempCoupon;
      }
      if (tempCoupon && tempCoupon.price < couponListBestOne.price) {
          couponListBestOne = tempCoupon;
      }
  }
  return couponListBestOne;
}
function  handleCouponPrice(originPrice, couponItem, resourcePrice, isMarketing) {
  // 优惠券是否支持 营销活动
  if (isMarketing && couponItem.can_use_with_activity !== 1) {
      return null;
  }
  // 折扣优惠券
  if (couponItem.discount_limit_price || couponItem.discount_percent) {
      // 满减限制
      if (couponItem.require_price > originPrice) {
          return null;
      }
      // 折扣限制
      if (couponItem.discount_limit_price) {
          return resourcePrice-(resourcePrice * couponItem.discount_percent) /
            100 <
            couponItem.discount_limit_price
            ? {
                price:
                  resourcePrice *
                  (couponItem.discount_percent / 100).toFixed(2),
                id: couponItem.id
              }
            : {
                price: resourcePrice - couponItem.discount_limit_price,
                id: couponItem.id
              };
      }
      return {
          price: resourcePrice * (couponItem.discount_percent / 100).toFixed(2),
          id: couponItem.id
      };
  }
  // 满减优惠券
  if (couponItem.require_price) {
      return originPrice < couponItem.require_price
          ? null
          : {
                price: resourcePrice - couponItem.price > 0 ? resourcePrice - couponItem.price : 0,
                id: couponItem.id
            };
  }
  return {
      price: resourcePrice - couponItem.price > 0 ? resourcePrice - couponItem.price : 0,
      id: couponItem.id
  };
}