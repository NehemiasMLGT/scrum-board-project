const API_BASE = '/api';

async function handleResponse(res) {
  const json = await res.json();
  if (!res.ok || json.success === false) {
    const errorMsg = json.error?.message || 'Error en la petición';
    throw new Error(errorMsg);
  }
  return json.data;
}

export const api = {
  // Teams
  async getTeams() {
    const res = await fetch(`${API_BASE}/teams`);
    return handleResponse(res);
  },

  async getTeam(id) {
    const res = await fetch(`${API_BASE}/teams/${id}`);
    return handleResponse(res);
  },

  async createTeam(data) {
    const res = await fetch(`${API_BASE}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateTeam(id, data) {
    const res = await fetch(`${API_BASE}/teams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteTeam(id) {
    const res = await fetch(`${API_BASE}/teams/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  // Members
  async addMember(teamId, data) {
    const res = await fetch(`${API_BASE}/teams/${teamId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateMember(id, data) {
    const res = await fetch(`${API_BASE}/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteMember(id) {
    const res = await fetch(`${API_BASE}/members/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  async updateMemberStatus(id, status) {
    const res = await fetch(`${API_BASE}/members/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  async resetMembersStatus(teamId) {
    const res = await fetch(`${API_BASE}/teams/${teamId}/members/reset-status`, {
      method: 'POST'
    });
    return handleResponse(res);
  },

  async reorderMembers(teamId, mode) {
    const res = await fetch(`${API_BASE}/teams/${teamId}/members/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode })
    });
    return handleResponse(res);
  },

  // Columns & Tasks
  async getColumns(teamId) {
    const res = await fetch(`${API_BASE}/teams/${teamId}/columns`);
    return handleResponse(res);
  },

  async createTask(data) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateTask(id, data) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async moveTask(id, targetColumnId, newPosition) {
    const res = await fetch(`${API_BASE}/tasks/${id}/move`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_column_id: targetColumnId,
        new_position: newPosition
      })
    });
    return handleResponse(res);
  },

  async deleteTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  }
};
