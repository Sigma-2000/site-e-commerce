<template>
    <div class="management-order-view">
        <div class="underline-short"></div>
        <router-link to="/panel-admin" class="pages-link">
            <h2>{{ $t('menu.account') }}</h2>
        </router-link>
        <div class="underline-long"></div>
        <h3>{{ $t('account.welcome-admin') }}</h3>
        <h3>{{ $t('panel-admin.want-to-do') }}</h3>
        <div class="admin-painting">
            <img src="/images/autoportrait.jpg" alt="autoportrait painting" />
        </div>
        <div class="underline-center"></div>
        <ErrorComponent v-if="error" :error="error" />
        <SuccessComponent v-if="success" :success="success" />
        <div v-if="ordersWithUserAndAddress.length > 0">
            <div v-for="order in ordersWithUserAndAddress" :key="order.id">
                <div class="order-content">
                    <div class="order-details-user">
                        <div class="order-details-general">
                            <p>
                                {{ $t('order.date') }} : <strong>{{ order.formattedDate }}</strong>
                            </p>
                            <p>
                                {{ $t('account.status-order') }}
                                <span v-if="editingOrderId === order.id">
                                    <select v-model="selectedStatus">
                                        <option
                                            v-for="status in getStatusesForOrder(order)"
                                            :key="status"
                                            :value="status"
                                            :disabled="status === 'paid'"
                                        >
                                            {{ $t(`order-status.${status}`) }}
                                        </option>
                                    </select>
                                    <input
                                        v-if="
                                            selectedStatus === 'shipped' &&
                                            order.shippingMethod === 'colissimo_signature'
                                        "
                                        v-model="selectedTrackingNumber"
                                        type="text"
                                        :placeholder="$t('order.tracking-placeholder')"
                                    />

                                    <ButtonComponent
                                        @click="updateStatus(order)"
                                        class="button-save"
                                    >
                                        {{ $t('button.save') }}
                                    </ButtonComponent>
                                </span>
                                <span v-else>
                                    <strong>
                                        {{ $t(`order-status.${order.status}`) }}</strong
                                    > </span
                                ><Icon
                                    icon="fluent-mdl2:field-not-changed"
                                    @click="toggleEdit(order)"
                                    width="20px"
                                    class="modify-icon"
                                />
                            </p>
                            <p v-if="order.shippedAt">
                                {{ $t('order.shipped-at') }} :
                                <strong>{{ order.shippedAt }}</strong>
                            </p>
                            <p v-if="order.deliveredAt">
                                {{ $t('order.delivered-at') }} :
                                <strong>{{ order.deliveredAt }}</strong>
                            </p>
                            <p>
                                {{ $t('order.amount') }} : <strong>{{ order.amount }} €</strong>
                            </p>
                        </div>
                        <p>
                            {{ $t('order.ordered') }}
                            <strong>{{ order.user.firstName }} {{ order.user.lastName }}</strong>
                        </p>
                        <p>
                            {{ $t('order.contact') }} <strong> {{ order.user.email }}</strong>
                        </p>
                        <p>
                            {{ $t('order.delivery-method') }} :

                            <strong v-if="order.shippingMethod === 'pickup_lyon'">
                                {{ $t('order.pickup-lyon') }}
                            </strong>

                            <strong v-else>
                                {{ $t('order.colissimo-signature') }}
                            </strong>
                        </p>

                        <p v-if="order.shippingMethod === 'colissimo_signature'">
                            <strong>
                                {{ order.address.street }},
                                {{ order.address.postalCode }}
                                {{ order.address.city }},
                                {{ order.address.country }}
                            </strong>
                        </p>

                        <p
                            v-if="
                                order.shippingMethod === 'colissimo_signature' &&
                                order.trackingNumber
                            "
                        >
                            {{ $t('order.tracking-number') }} :
                            <strong>
                                {{ order.trackingNumber }}
                            </strong>
                        </p>

                        <p v-if="order.shippingMethod === 'pickup_lyon'">
                            {{ $t('order.pickup-contact') }}
                        </p>
                    </div>
                    <div class="order-details-products">
                        <div v-for="product in order.products" :key="product.id">
                            <img :src="product.image" alt="product image" />
                            <p>
                                {{ $t('order.quantity') }}<strong>{{ product.quantity }}</strong>
                            </p>
                            <p>
                                {{ $t('form-product.category') }}:
                                <strong>{{ product.category }}</strong>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="underline-center"></div>
            </div>
        </div>
        <div v-else>
            <p>{{ $t('account.no-order') }}</p>
        </div>
    </div>
</template>

<script setup>
import { useOrdersStore } from '@/stores/ordersStore';
import { onMounted, computed, ref } from 'vue';
import { formatDate } from '@/utils/helpers.js';
import { Icon } from '@iconify/vue';
import ErrorComponent from '@/components/ui/ErrorComponent.vue';
import SuccessComponent from '@/components/ui/SuccessComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
const ordersStore = useOrdersStore();

const orders = computed(() => ordersStore.orders);
const error = computed(() => ordersStore.error);
const success = computed(() => ordersStore.success);

const currentOrders = computed(() => {
    if (ordersStore.filterType === 'in-progress') {
        return orders.value.filter(
            (order) => order.status_order !== 'cancelled' && order.status_order !== 'delivered'
        );
    }
    return orders.value;
});
const ordersWithUserAndAddress = computed(() =>
    currentOrders.value.map((order) => ({
        id: order._id,
        status: order.status_order,
        amount: order.total_price,
        formattedDate: formatDate(order.order_date),
        shippingMethod: order.shipping_method,
        trackingNumber: order.tracking_number || '',
        deliveredAt: order.delivered_at ? formatDate(order.delivered_at) : null,
        shippedAt: order.shipped_at ? formatDate(order.shipped_at) : null,

        user: {
            firstName: order.user_id?.firstName || 'N/A',
            lastName: order.user_id?.lastName || 'N/A',
            email: order.user_id?.email || 'N/A',
        },
        address: {
            street: order.address_id?.street || 'N/A',
            city: order.address_id?.city || 'N/A',
            postalCode: order.address_id?.postal_code || 'N/A',
            country: order.address_id?.country || 'N/A',
        },
        products: order.products.map((product) => ({
            id: product.id?._id || 'unknown',
            image: product.id?.artwork_id?.images?.[0] || 'unknown',
            quantity: product.quantity || 'unknown',
            category: product.id?.category || 'unknown',
        })),
    }))
);

//'cancelled']; v4
const getStatusesForOrder = (order) => {
    const statuses = ['pending', 'paid', 'shipped', 'delivered'];

    if (order.shippingMethod === 'pickup_lyon') {
        return statuses.filter((status) => status !== 'shipped');
    }

    return statuses;
};
const editingOrderId = ref(null);
const selectedStatus = ref('');
const selectedTrackingNumber = ref('');

const toggleEdit = (order) => {
    if (editingOrderId.value === order.id) {
        editingOrderId.value = null;
        return;
    }

    editingOrderId.value = order.id;
    selectedStatus.value = order.status;

    selectedTrackingNumber.value = order.trackingNumber || '';
};

const updateStatus = async (order) => {
    if (
        selectedStatus.value === 'shipped' &&
        order.shippingMethod === 'colissimo_signature' &&
        !selectedTrackingNumber.value.trim()
    ) {
        ordersStore.setError('errors.tracking-required');

        return;
    }

    const result = await ordersStore.updateOrderStatus(
        order.id,
        selectedStatus.value,
        selectedTrackingNumber.value
    );

    if (!result) {
        return;
    }

    editingOrderId.value = null;
    selectedTrackingNumber.value = '';

    await ordersStore.fetchAllOrders();

    if (result.email_sent === false) {
        ordersStore.setError('errors.shipping-email-failed');
    }
};

onMounted(() => {
    ordersStore.fetchAllOrders();
    ordersStore.resetErrorSuccess();
});
</script>
