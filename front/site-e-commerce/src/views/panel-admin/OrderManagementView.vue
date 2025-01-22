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
                                    <select
                                        v-model="selectedStatus"
                                        @change="updateStatus(order.id)"
                                    >
                                        <option
                                            v-for="status in validStatuses"
                                            :key="status"
                                            :value="status"
                                        >
                                            {{ $t(`order-status.${status}`) }}
                                        </option>
                                    </select>
                                </span>
                                <span v-else>
                                    <strong> {{ $t(`order-status.${order.status}`) }}</strong>
                                </span>
                                <Icon
                                    icon="fluent-mdl2:field-not-changed"
                                    @click="toggleEdit(order.id, order.status)"
                                    width="20px"
                                    class="modify-icon"
                                />
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
                            {{ $t('order.delivery') }}
                            <strong
                                >{{ order.address.street }},
                                {{ order.address.postalCode }}
                                {{ order.address.city }}, {{ order.address.country }}
                            </strong>
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

const ordersStore = useOrdersStore();

const orders = computed(() => ordersStore.orders);
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

console.log(ordersWithUserAndAddress.value);

const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
const editingOrderId = ref(null);
const selectedStatus = ref('');

const toggleEdit = (orderId, currentStatus) => {
    if (editingOrderId.value === orderId) {
        editingOrderId.value = null;
    } else {
        editingOrderId.value = orderId;
        selectedStatus.value = currentStatus;
    }
};
const updateStatus = async (orderId) => {
    await ordersStore.updateOrderStatus(orderId, selectedStatus.value);
    editingOrderId.value = null;
    await ordersStore.fetchAllOrders();
};

onMounted(() => {
    ordersStore.fetchAllOrders();
});
</script>
